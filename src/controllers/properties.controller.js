const SENDMAIL = require('../mail');
const prisma = require('../prisma');

const fetchProperties = async (query) => {
    // console.log("query 2", query);
    let whereClause = {};
    let orderByClause = {};
    query.metroDistance=parseInt(query.metroDistance);
    query.schoolDistance=parseInt(query.schoolDistance);
    query.hospitalDistance=parseInt(query.hospitalDistance);
    query.minPrice=parseInt(query.minPrice);
    query.maxPrice=parseInt(query.maxPrice);
    if (query.sort !== '' && query.order !== '') {
        orderByClause[query.sort] = query.order;
    }
    if (query.search !== undefined && query.search !== '') {
        whereClause = {
            OR: [
                {
                    name: {
                        contains: query.search,
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: query.search,
                        mode: 'insensitive',
                    },
                },
                {
                    location: {
                        contains: query.search,
                        mode: 'insensitive',
                    },
                },
            ],
            AND: [
                {
                    metroDistance: {
                        lte: query.metroDistance !== 0 ? query.metroDistance : 1000
                    }
                },
                {
                    schoolDistance: {
                        lte: query.schoolDistance !== 0 ? query.schoolDistance : 1000
                    }
                },
                {
                    hospitalDistance: {
                        lte: query.hospitalDistance !== 0 ? query.hospitalDistance : 1000
                    }
                },
                {
                    price: {
                        gte: query.minPrice,
                        lte: query.maxPrice
                    }
                }
            ]
        }
    }

    const properties = await prisma.property.findMany({
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contact: true,
                }
            },
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contact: true,
                }
            }
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        where: whereClause,
        orderBy: orderByClause
    });
    // console.log("properties", properties);
    return properties;
}

const fetchPropertyById = async (id) => {
    const property = await prisma.property.findUnique({
        where: {
            id,
        },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contact: true,
                }
            },
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contact: true,
                }
            }
        }

    });
    return property;
}

const fetchPropertiesByOwner = async (ownerId, query) => {
    // console.log("query", query);
    let whereClause = {
        ownerId,
        AND: [
            {
                metroDistance: {
                    lte: query.metroDistance !== 0 ? query.metroDistance : 1000
                }
            },
            {
                schoolDistance: {
                    lte: query.schoolDistance !== 0 ? query.schoolDistance : 1000
                }
            },
            {
                hospitalDistance: {
                    lte: query.hospitalDistance !== 0 ? query.hospitalDistance : 1000
                }
            },
            {
                price: {
                    gte: query.minPrice,
                    lte: query.maxPrice
                }
            }
        ]
    };
    let orderByClause = {};
    if (query.sort !== '' && query.order !== '') {
        orderByClause[query.sort] = query.order;
    }
    if (query.search !== undefined && query.search !== '') {
        whereClause = {
            ...whereClause,
            OR: [
                {
                    name: {
                        contains: query.search,
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: query.search,
                        mode: 'insensitive',
                    },
                },
                {
                    location: {
                        contains: query.search,
                        mode: 'insensitive',
                    },
                },
            ],
        }
    }
    const properties = await prisma.property.findMany({
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contact: true,
                }
            },
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contact: true,
                }
            }
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        where: whereClause,
        orderBy: orderByClause
    });
    // console.log("in cont",properties)
    return properties;
}

const addProperty = async (data) => {
    const { name, description, price, city, location, ownerId, images, area, metroDistance, schoolDistance, hospitalDistance } = data;
    // console.log("data", data);
    let amenities = data.amenities
    amenities = amenities.split(',').map((amenity) => amenity.trim());
    let nearbyMetros = data.nearbyMetros
    nearbyMetros = nearbyMetros.split(',').map((metro) => metro.trim());
    let nearbySchools = data.nearbySchools
    nearbySchools = nearbySchools.split(',').map((school) => school.trim());
    let nearbyHospitals = data.nearbyHospitals
    nearbyHospitals = nearbyHospitals.split(',').map((hospital) => hospital.trim());
    const property = await prisma.property.create({
        data: {
            name,
            description,
            price: parseFloat(price),
            owner: {
                connect: {
                    id: ownerId
                }
            },
            city,
            amenities,
            location,
            images,
            area,
            nearbyMetros,
            nearbySchools,
            nearbyHospitals,
            metroDistance,
            schoolDistance,
            hospitalDistance
        },
    });
    // console.log(property)
    return property;
}

const updateProperty = async (data) => {
    const { id, name, description, area, location, city, images } = data;
    let price = data.price;
    let amenities = data.amenities;
    if (amenities) {
        amenities = amenities.split(',').map((amenity) => amenity.trim());
    }

    price = price.replace(/inr|INR|Inr|₹|-\/|[a-z]|[A-Z]|,|\s/g, '').trim();

    if (isNaN(parseFloat(price))) {
        return { error: "Invalid price" }
    }


    const property = await prisma.property.update({
        where: {
            id,
        },
        data: {
            name,
            description,
            price: parseFloat(price),
            amenities,
            area,
            city,
            location,
            images

        },
    });
    return property;
}

const deleteProperty = async (propertyId, ownerId) => {
    const property = await prisma.property.findFirst({
        where: {
            id: propertyId,
            ownerId
        },
    });

    if (!property) {
        throw new Error('Property not found or you do not have permission to delete this property');
    }

    const deletedProperty = await prisma.property.delete({
        where: {
            id: propertyId
        }
    });

    return deletedProperty;
}

const handleMailSend = async (ownerMail, buyer, property) => {
    const mailDetails = {
        from: process.env.MAIL_USERNAME,
        to: ownerMail,
        subject: 'Interest shown in your property',
        html: `
        <h1>Hello,</h1>
        <p>Someone has shown interest in your property ${property.name}.</p>
        <h2>Interested Person Details:</h2>
        <p>Name: ${buyer.name}</p>
        <p>Email: ${buyer.email}</p>
        <p>Contact: ${buyer.contact}</p>
        <h2>Property Details:</h2>
        <p>Property Name: ${property.name}</p>
        <p>Description: ${property.description}</p>
        <p>Price: ${property.price}</p>
        <p>Location: ${property.location}</p>
        ${property.images.map(image => `<img src="${image}" alt="Property image" />`).join('')}
        `
    };

    const mailDetailsBuyer = {
        from: process.env.MAIL_USERNAME,
        to: buyer.email,
        subject: 'Interest shown in property',
        html: `
    <h1 style="color: blue;">Hello,</h1>
    <p>You have shown interest in the property <strong>${property.name}</strong>.</p>
    <h2>Owner Details:</h2>
    <ul>
        <li><strong>Name:</strong> ${property.owner.name}</li>
        <li><strong>Email:</strong> ${property.owner.email}</li>
        <li><strong>Contact:</strong> ${property.owner.contact}</li>
    </ul>
    <h2>Property Details:</h2>
    <ul>
        <li><strong>Property Name:</strong> ${property.name}</li>
        <li><strong>Description:</strong> ${property.description}</li>
        <li><strong>Price:</strong> ${property.price}</li>
        <li><strong>Location:</strong> ${property.location}</li>
        <li><strong>Area:</strong> ${property.area}</li>
        <li><strong>Amenities:</strong> ${property.amenities.join(', ')}</li>
    </ul>
    <h2>Property Images:</h2>
    ${property.images.slice(0, 2).map(image => `<img src="${image}" alt="Property image" style="width: 100px; height: 100px;" />`).join('')}
    `
    };
    await SENDMAIL(mailDetails, (info) => {
        console.log("Mail sent to owner", info);
    });
    await SENDMAIL(mailDetailsBuyer, (info) => {
        console.log("Mail sent to tenant", info);
    });
    return "Mail sent";
}


module.exports = { fetchPropertiesByOwner, addProperty, fetchProperties, fetchPropertyById, updateProperty, deleteProperty, handleMailSend };