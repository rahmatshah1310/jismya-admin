import Image from "next/image";
import Button from "@/components/ui/Button";
import ToggleSwitch from "../ui/ToggleSwitch";

export default function BannerTable({
  title,
  banners,
  handleViewBanner,
  handleReorderBanner,
  handleDeleteBanner,
  handleEditBanner,
  handleToggle,
}) {
  return (
    <section>
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <div className="block w-full overflow-x-auto">
        <table className="w-full table-auto border text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 min-w-[140px]">Image</th>
              <th className="p-2 min-w-[200px]">Heading</th>
              <th className="p-2 min-w-[250px]">Description</th>
              <th className="p-2 min-w-[120px]">Device</th>
              <th className="p-2 min-w-[100px]">Status</th>
              <th className="p-2 min-w-[80px]">Order</th>
              <th className="p-2 min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners?.map((banner) => (
              <tr key={banner._id} className="border-t text-center">
                <td className="p-2 min-w-[140px]">
                  <Image
                    src={banner.imageUrl}
                    alt="banner"
                    width={120}
                    height={10}
                    className="rounded-md h-[80px] object-cover"
                  />
                </td>
                <td className="p-2 min-w-[10px] max-w-[10px] overflow-hidden whitespace-nowrap text-ellipsis">
                  {banner.heading}
                </td>
                <td className="p-2 min-w-[100px] max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis">
                  {banner.description}
                </td>
                <td className="p-2 min-w-[120px]">{banner.deviceType}</td>

                <td className="p-2 min-w-[100px]">
                  <ToggleSwitch
                    isActive={banner.isActive}
                    onToggle={() => handleToggle(banner._id, banner.isActive)}
                    activeText="Active"
                    inactiveText="Inactive"
                  />
                </td>

                <td className="p-2 min-w-[80px]">{banner.order}</td>
                <td className="p-2 min-w-[350px] space-x-2">
                  <Button
                    onClick={() => handleViewBanner(banner._id)}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => {
                      handleEditBanner(banner);
                    }}
                    className="px-2 py-1 bg-blue-500 text-white rounded "
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleReorderBanner(banner)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Reorder
                  </Button>
                  <Button
                    onClick={() => handleDeleteBanner(banner._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
