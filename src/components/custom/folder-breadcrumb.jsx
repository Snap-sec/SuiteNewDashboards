import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';

export function FolderBreadcrumb({ path = [], onNavigate, isClickable = true }) {
  return (
    <div className="w-1/6 lg:w-fit mt-4">
      <Card>
        <CardContent className="px-4 py-2.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="cursor-pointer flex items-center gap-1"
                  onClick={() => isClickable && onNavigate([])}
                >
                  <Home className="size-4" />Home 
                </BreadcrumbLink>
              </BreadcrumbItem>
              {path.map((folder, idx) => (
                <span key={folder._id} className="flex items-center">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className={isClickable ? "cursor-pointer" : ""}
                      onClick={() => isClickable && onNavigate(path.slice(0, idx + 1))}
                    >
                      {folder.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </span>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </CardContent>
      </Card>
    </div>
  );
}
