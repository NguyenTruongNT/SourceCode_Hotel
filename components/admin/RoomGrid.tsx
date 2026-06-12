import { Room, RoomStatus, RoomType } from '@/app/admin/types';

interface RoomGridProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
}

export default function RoomGrid({ rooms, onSelectRoom }: RoomGridProps) {
  // Let's group rooms by floor
  const floors = [
    { floor: 2, label: 'Tầng 2 - Deluxe', type: RoomType.DELUXE },
    { floor: 3, label: 'Tầng 3 - Superior', type: RoomType.SUPERIOR },
    { floor: 4, label: 'Tầng 4 - Standard', type: RoomType.STANDARD },
    { floor: 5, label: 'Tầng 5 - Suite', type: RoomType.SUITE }
  ];

  const getStatusClasses = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.EMPTY:
        return 'bg-white border border-slate-200 hover:border-slate-300';
      case RoomStatus.BOOKED:
        return 'bg-[#fef9c3] border border-[#fde047] hover:border-yellow-400';
      case RoomStatus.OCCUPIED:
        return 'bg-[#fee2e2] border border-[#fecaca] hover:border-rose-300';
      case RoomStatus.CLEANING:
        return 'bg-[#e5e7eb] border border-[#d1d5db] hover:border-slate-400';
      default:
        return 'bg-white border border-slate-200';
    }
  };

  const getSubText = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.EMPTY:
        return <span className="text-[10px] text-slate-400">Trống</span>;
      case RoomStatus.BOOKED:
        return <span className="text-[10px] text-amber-700 font-medium">Đã đặt</span>;
      case RoomStatus.OCCUPIED:
        return <span className="text-[10px] text-red-500 font-medium">Đang ở</span>;
      case RoomStatus.CLEANING:
        return <span className="text-[10px] text-slate-500 font-medium">Dọn dẹp</span>;
      default:
        return <span className="text-[10px] text-slate-400">Trống</span>;
    }
  };

  return (
    <div className="space-y-10">
      {floors.map((floorObj) => {
        const floorRooms = rooms.filter((r) => r.floor === floorObj.floor);
        return (
          <section key={floorObj.floor} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-4 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-blue-600 rounded-sm"></span>
              {floorObj.label}
            </h3>
            <div className="flex flex-wrap gap-4">
              {floorRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => onSelectRoom(room)}
                  className={`w-28 h-24 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:scale-95 ${getStatusClasses(
                    room.status
                  )}`}
                  title={`Phòng ${room.id} - Bấm để xem thông tin hoặc check-in`}
                >
                  <span className="text-xl font-bold text-gray-800 tracking-tight">
                    {room.id}
                  </span>
                  <div className="mt-1 flex items-center space-x-1">
                    {room.status === RoomStatus.OCCUPIED && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                    {room.status === RoomStatus.BOOKED && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    )}
                    {getSubText(room.status)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
