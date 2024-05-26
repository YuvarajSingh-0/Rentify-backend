const prisma = require('../prisma');

const getIssuesByOwnerId = async (ownerId) => {
    const issues = await prisma.issues.findMany({
        where: {
            property: {
                ownerId: ownerId
            }
        },
        include: {
            property: true
        }
    });
    return issues;
}

const fetchIssuesByTenant=async (tenantId)=>{
    const issues=await prisma.issues.findMany({
        where:{
            property:{
                tenantId:tenantId
            }
        },
        include:{
            property:true
        }
    });
    return issues;
}

const addIssue = async ({ title, description, propertyId }) => {
    const issue = await prisma.issue.create({
        data: {
            title,
            description,
            property: {
                connect: {
                    propertyId
                }
            }
        }
    });
    return issue;
}


module.exports = { getIssuesByOwnerId, fetchIssuesByTenant , addIssue};