import {PermissionsCheck} from '../components/permission';
import { Skeleton } from "@/components/ui/skeleton";


function NotificationsTab({ data, loading }) {

    if (loading) {
      return (
        <div>
          <Skeleton className="h-[70px[" />
          <Skeleton className="w-full h-[70px[" />
          <Skeleton className="w-full h-[70px[" />
          <Skeleton className="w-full h-[70px[" />
          <Skeleton className="w-full h-[70px[" />
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        <div>
        <h2 className='text-sm+ font-semibold'>Notification</h2>
        <p>This tab contains basic details of the assessment.</p>
        </div>

        <PermissionsCheck assessment={data} />
      </div>
    );
}


export default NotificationsTab;