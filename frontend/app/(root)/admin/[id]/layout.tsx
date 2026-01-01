import { api } from "@/lib/api";

export async function generateMetadata({ params }: RouteParams) {
  const { id } = await params;
  const { data } = (await api.locations.getLocation(id)) as ActionResponse<{
    location: LocationData;
  }>;

  return {
    title: `TicketSpace | ${data?.location?.name || "สถานที่"} `,
    description: data?.location?.details?.slice(0, 160),
  };
}

const AdminLocationBookingsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default AdminLocationBookingsLayout;
