"use server"

import { db } from '@/lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';


export async function getOrganization(slug: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Get the organization details
    const organization = (await clerkClient()).organizations.getOrganization({
        slug,
    });

    if (!organization) {
        return null;
    }

    // Check if user belongs to this organization
    const membershipResponse =
        (await clerkClient()).organizations.getOrganizationMembershipList({
            organizationId: (await organization).id,
        });

    const userMembership = (await membershipResponse).data.find(
        (member: any) => member.publicUserData.userId === userId
    );

    // If user is not a member, return null
    if (!userMembership) {
        return null;
    }

    return organization;
}