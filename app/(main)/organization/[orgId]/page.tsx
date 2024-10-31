import { getOrganization } from '@/actions/organization';
import React from 'react'
import OrgSwitcher from '../../../../components/orgswitcher';

interface OrganizationProps {
    params: {
        orgId: string;
    };
}

const Organization: React.FC<OrganizationProps> = async ({ params }) => {
    const { orgId } = params;

    const organization = await getOrganization(orgId);

    if (!organization) {
        return <div>Organization not found</div>
    }

    return (
        <div className="container mx-auto px-4">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
                <h1 className="text-5xl font-bold gradient-title pb-2">
                    {organization.name}&rsquo;s Projects
                </h1>

                <OrgSwitcher />
            </div>
            <div className="mb-4">
                {/* <ProjectList orgId={organization.id} /> */}
            </div>
            <div className="mt-8">
                {/* <UserIssues userId={userId} /> */}
            </div>
        </div>
    );
}

export default Organization