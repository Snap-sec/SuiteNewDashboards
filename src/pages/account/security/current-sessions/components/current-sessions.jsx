import { Cpu, Globe, Laptop, Monitor, Smartphone, Tablet } from 'lucide-react';
import {
  FaAndroid,
  FaApple,
  FaChrome,
  FaEdge,
  FaFirefox,
  FaLinux,
  FaOpera,
  FaSafari,
  FaWindows,
} from 'react-icons/fa6';
import { Link } from 'react-router';
import { formatDate, formatDateTime } from '@/lib/helpers';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import PageHeading from '@/components/custom/page-heading';
import { useGetMemberActivityQuery } from '../../../../../services/auth/orgApi';
import useStore from '../store';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

const getBrowserIcon = (browser) => {
  const b = (browser || '').toLowerCase();
  if (b.includes('chrome') || b.includes('chromium')) {
    return <FaChrome className="w-4 h-4 shrink-0" />;
  }
  if (b.includes('edge') || b.includes('edg')) {
    return <FaEdge className="w-4 h-4 shrink-0" />;
  }
  if (b.includes('firefox') || b.includes('mozilla')) {
    return <FaFirefox className="w-4 h-4 shrink-0" />;
  }
  if (b.includes('safari') && !b.includes('chrome')) {
    return <FaSafari className="w-4 h-4 shrink-0" />;
  }
  if (b.includes('opera') || b.includes('opr')) {
    return <FaOpera className="w-4 h-4 shrink-0" />;
  }
  return <Globe className="w-4 h-4 shrink-0" />;
};

const getDeviceIcon = (device) => {
  const d = (device || '').toLowerCase();
  if (d.includes('mobile') || d.includes('phone') || d.includes('iphone')) {
    return <Smartphone className="w-4 h-4 shrink-0" />;
  }
  if (d.includes('tablet') || d.includes('ipad')) {
    return <Tablet className="w-4 h-4 shrink-0" />;
  }
  if (d.includes('laptop') || d.includes('notebook') || d.includes('macbook')) {
    return <Laptop className="w-4 h-4 shrink-0" />;
  }
  return <Monitor className="w-4 h-4 shrink-0" />;
};

const getOsIcon = (os) => {
  const o = (os || '').toLowerCase();
  if (o.includes('win')) {
    return <FaWindows className="w-4 h-4 shrink-0" />;
  }
  if (
    o.includes('linux') ||
    o.includes('ubuntu') ||
    o.includes('debian') ||
    o.includes('centos') ||
    o.includes('fedora') ||
    o.includes('red hat') ||
    o.includes('arch')
  ) {
    return <FaLinux className="w-4 h-4 shrink-0" />;
  }
  if (o.includes('mac') || o.includes('ios') || o.includes('apple') || o.includes('darwin')) {
    return <FaApple className="w-4 h-4 shrink-0" />;
  }
  if (o.includes('android')) {
    return <FaAndroid className="w-4 h-4 text-muted-foreground shrink-0" />;
  }
  return <Cpu className="w-4 h-4 text-muted-foreground shrink-0" />;
};

const getColumns = () => [
  // {
  //   accessorKey: 'id',
  //   accessorFn: (row) => row.id,
  //   header: () => <DataGridTableRowSelectAll />,
  //   cell: ({ row }) => <DataGridTableRowSelect row={row} />,
  //   enableSorting: false,
  //   enableHiding: false,
  //   enableResizing: false,
  //   size: 51,
  //   meta: {
  //     cellClassName: '',
  //   },
  // },
  {
    id: 'user',
    accessorFn: (row) => row.user,
    header: ({ column }) => (
      <DataGridColumnHeader title="Person" column={column} />
    ),

    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <Link
          to={`/profile/account/security/security-log`}
          state={{ email: row.original.email }}
        >
          <Profile
            email={row.original.email}
            name={row.original.name || "-"}
            role={row.original.role || "-"}
          />
        </Link>
      </div>
    ),

    enableSorting: true,
    size: 290,
    meta: {
      headerClassName: '',
      skeleton: <Skeleton className="w-full h-[20px]" />,
    },
  },
  {
    id: 'lastLogin',
    accessorFn: (row) => row.lastLogin,
    header: ({ column }) => (
      <DataGridColumnHeader title="Last Login" column={column} />
    ),

    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-secondary-foreground">
          {formatDateTime(row.original.lastLogin)}
        </span>
      </div>
    ),

    enableSorting: true,
    size: 300,
    meta: {
      headerClassName: '',
      skeleton: <Skeleton className="w-full h-[20px]" />,
    },
  },
  {
    id: 'browser',
    accessorFn: (row) => row.browser,
    header: ({ column }) => (
      <DataGridColumnHeader title="Browser" column={column} />
    ),

    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {getBrowserIcon(row.original.lastLoginBrowser)}
        <span className="text-secondary-foreground">
          {row.original.lastLoginBrowser || 'Unknown Browser'}
        </span>
      </div>
    ),

    enableSorting: true,
    size: 260,
    meta: {
      headerClassName: '',
      skeleton: <Skeleton className="w-full h-[20px]" />,
    },
  },
  // {
  //   id: 'ipAddress',
  //   accessorFn: (row) => row.ipAddress,
  //   header: ({ column }) => (
  //     <DataGridColumnHeader title="Login IP" column={column} />
  //   ),

  //   cell: ({ row }) => (
  //     <span className="text-secondary-foreground font-normal">
  //       {row.original.lastLoginIp || 'Unknown IP'}
  //     </span>
  //   ),

  //   enableSorting: true,
  //   size: 240,
  //   meta: {
  //     headerClassName: '',
  //     skeleton: <Skeleton className="h-[20px]" />,
  //   },
  // },
  {
    id: 'device',
    accessorFn: (row) => row.device,
    header: ({ column }) => (
      <DataGridColumnHeader title="Login Device" column={column} />
    ),

    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {getDeviceIcon(row.original.lastLoginDevice)}
        <span className="leading-none text-secondary-foreground">
          {row.original.lastLoginDevice || 'Unknown Device'}
        </span>
      </div>
    ),

    enableSorting: true,
    size: 200,
    meta: {
      headerClassName: '',
      skeleton: <Skeleton className="w-full h-[20px]" />,
    },
  },
  {
    id: 'os',
    accessorFn: (row) => row.os,
    header: ({ column }) => (
      <DataGridColumnHeader title="Login OS" column={column} />
    ),

    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {getOsIcon(row.original.lastLoginOs)}
        <span className="leading-none text-secondary-foreground">
          {row.original.lastLoginOs || 'Unknown OS'}
        </span>
      </div>
    ),

    enableSorting: true,
    size: 200,
    meta: {
      headerClassName: '',
      skeleton: <Skeleton className="w-full h-[20px]" />,
    },
  },
];

const CurrentSessions = () => {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);

  const { data: memberActivity, isLoading: activityLoading, isFetching, isError, error } =
    useGetMemberActivityQuery({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: searchQuery,
    });

  const columns = getColumns();

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <div>
      <PageHeading
        title="Current Sessions"
        description="View and manage authorized devices and active sessions with access to your security reports and account."
      />
      <Table
        data={memberActivity?.data || []}
        totalPages={
          Math.ceil(memberActivity?.data?.total / memberActivity?.data?.limit) ||
          1
        }
        columns={columns}
        isLoading={activityLoading || isFetching}
        pagination={pagination}
        setPagination={setPagination}
        search={searchQuery}
        setSearch={setSearchQuery}
        enableSorting={false}
        enableSearch={true}
        className="mt-1"
      />
    </div>
  );
};

export { CurrentSessions };
