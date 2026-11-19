import { useEffect, useState } from 'react';
import PageHeading from '@/components/custom/page-heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MatricsTab from './components/Tabs/matrics';
import Endpoints from './components/Tabs/endpoints';
import Threats from './components/Tabs/threats';
import ProjectDetails from './components/Tabs/project-details';
import PromptSetting from '../prompt-setting/prompt-setting';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function ProjectDetail(){

    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const name = params.get('name');


    return(
        <div className="p-4">
            <PageHeading title={name}/>
            <Helmet>
                <title>Threat Modeler | Project Details</title>
            </Helmet>

            <Tabs defaultValue="metrics">
                <TabsList variant="line" size="md" className="border-b">
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
                    <TabsTrigger value="threats">Threats</TabsTrigger>

                    <AuthorityGuard roles="Admin">
                       <TabsTrigger value="ProjectDetails">Project Settings</TabsTrigger>
                    </AuthorityGuard>

                    <AuthorityGuard roles="Admin">
                       <TabsTrigger value="Settings">Admin Settings</TabsTrigger>
                    </AuthorityGuard>
                </TabsList>



                <TabsContent value="metrics">
                    <div className="p-4">
                       <MatricsTab />
                    </div>
                </TabsContent>


                
                <TabsContent value="endpoints">
                    <div className="p-4">
                       <Endpoints />
                    </div>
                </TabsContent>


                
                <TabsContent value="threats">
                    <div className="p-4">
                       <Threats />
                    </div>
                </TabsContent>


                <TabsContent value="ProjectDetails">
                    <div className="p-4">
                       <ProjectDetails />
                    </div>
                </TabsContent>

            
                <TabsContent value="Settings">
                    <div className="">
                       <PromptSetting />
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    )
}


export default ProjectDetail;