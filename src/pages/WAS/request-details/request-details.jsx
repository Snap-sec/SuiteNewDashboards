
import PageHeading from '@/components/custom/page-heading';
import { MethodBadge } from '../../../components/custom/method-badge';
import Editor from '../../../components/custom/Editor';

function RequestDetails() {
    return (
        <div className='p-4'>
            <PageHeading
                title="Request Details"
                description="View the full request and response data for this API calls."
            />


            <div className='grid lg:grid-cols-2 gap-10 items-stretch mt-6'>
                <div className='lg:col-span-1'>
                    <div className='flex items-center justify-between gap-4'>
                        <p className='text-base font-semibold leading-none tracking-tight'>
                            Request
                        </p>

                        <div className='flex items-center gap-4'>
                            <MethodBadge method={'POST'} />
                            <p className='text-sm font-normal text-secondary-foreground leading-5.5'>
                                /v1/charges
                            </p>
                        </div>
                    </div>


                    <div className='bg-accent p-4 rounded-lg mt-4'>
                        <Editor
                            defaultValue={`
                            {
                                "id": "686cb40187ab2b00122e12df",
                                "firstName": "Shoaib",
                                "lastName": "Wani",
                                "email": "letmeuseit158@gmail.com",
                                "_id": "68d6272b15e5a481cbcee897"
                            }    
                            `}
                            readOnly={true}
                        />
                    </div>
                </div>

                <div className='lg:col-span-1'>
                    <div className='flex items-center justify-between gap-4'>
                        <p className='text-base font-semibold leading-none tracking-tight'>
                            Response
                        </p>

                        <div className='flex items-center gap-4'>
                            <MethodBadge method={'200 OK'} />
                            <p className='text-sm font-normal text-secondary-foreground leading-5.5'>
                                150ms
                            </p>
                        </div>
                    </div>

                    <div className='bg-accent p-4 rounded-lg mt-4'>
                        <Editor
                            defaultValue={`
                            {
                                "id": "686cb40187ab2b00122e12df",
                                "firstName": "Shoaib",
                                "lastName": "Wani",
                                "email": "letmeuseit158@gmail.com",
                                "_id": "68d6272b15e5a481cbcee897"
                            }    
                            `}
                            readOnly={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default RequestDetails;