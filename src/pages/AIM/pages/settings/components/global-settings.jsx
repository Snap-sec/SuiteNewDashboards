import { HighlightedPosts } from './highlighted-posts';
import LinkForm from './forms/link-form';
import { Search, Edit3 } from 'lucide-react';

const GlobalSettings = ({ orgID }) => {
    const posts = [
        {
            icon: Search,
            title: 'Public Asset Search: Discover Asset Details Instantly',
            summary:
                'Use this public link to search and view global asset information, including vulnerabilities and reports. Ideal for quick, read-only access.',
            path: '#',
        },
        {
            icon: Edit3,
            title: 'Edit Asset Information: Update Name & Exposure Publicly',
            summary:
                'Access this public link to view and update asset details such as name and exposure status. Share responsibly to ensure data integrity.',
            path: '#',
        },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-4 py-4">
            <div className="w-full">
                <div className="grid lg:grid-cols-1 gap-5 lg:gap-7.5">
                    <LinkForm
                        title="Global Asset Search"
                        link={`${window.location.origin}/pages/public/${orgID}/search`}
                        description={
                            'Share this public link to search and access global assets, vulnerabilities, and reports.'
                        }
                    />

                    <LinkForm
                        title="Edit Asset"
                        link={`${window.location.origin}/pages/public/global/asset-edit/${orgID}`}
                        description="This public link allows users to view and update asset information. Share with caution."
                    />
                </div>
            </div>

            <div className=" w-full lg:w-1/2">
                <HighlightedPosts posts={posts} />
            </div>
        </div>
    );
};

export default GlobalSettings;
