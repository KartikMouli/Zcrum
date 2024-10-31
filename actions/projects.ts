"use server"

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";


export default async function createProject(data: any) {
    const { userId, orgId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    if (!orgId) {
        throw new Error("No Organization Selected");
    }

    // Check if the user is an admin of the organization
    const membershipListResponse = await (await clerkClient()).organizations.getOrganizationMembershipList({
        organizationId: orgId,
    });

    const membershipList = membershipListResponse.data; // Destructure data from the response


    const userMembership = membershipList.find(
        (membership: any) => membership.publicUserData.userId === userId
    );

    if (!userMembership || userMembership.role !== "org:admin") {
        throw new Error("Only organization admins can create projects");
    }

    try {
        const project = await db.project.create({
            data: {
                name: data.name,
                key: data.key,
                description: data.description,
                organizationId: orgId,
            },
        });

        return project;
    } catch (error: any) {
        throw new Error("Error creating project: " + error.message);
    }
}