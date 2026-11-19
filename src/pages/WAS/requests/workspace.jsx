import React, { useState } from 'react';
import { SearchInput } from "../../../components/custom/search";
import WorkspaceCard from './components/workspace-card';


function Workspace() {

    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);


    // Handles input change
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Handles Enter keypress
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
        setIsSearching(true);
        // Simulate async search with a timeout
        setTimeout(() => setIsSearching(false), 1000);
        }
    };

    return(
        <div className="flex justify-center items-center mt-8">
            
            <div className="w-2/4">
                <div className="flex flex-col gap-2 text-center">
                    <p class="text-lg leading-5 font-semibold text-mono">
                    Select a workspace to get started
                    </p>
                    <p className="text-sm">
                        Choose a Postman workspace to connect with your API intregrations.
                    </p>
                </div>


                <div className="bg-accent p-6 rounded-lg mt-6">
                    <SearchInput
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        isSearching={isSearching}
                        placeholder="Search Workspaces..."
                        className="w-full"
                    />



                    <div className='mt-4'>
                        <p class="text-lg leading-5 font-semibold text-mono">
                          Your Workspaces
                        </p>


                        <div className='flex flex-col gap-2 mt-4'>
                            <WorkspaceCard 
                                name={"Team Workspace"}
                                description="All team members can access and collaborate in this workspace."
                                onClick={()=> console.log("clicked")}
                            />

                            <WorkspaceCard 
                                name={"Team Workspacexxx"}
                                description="All team members can access and collaborate in this workspace."
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Workspace;