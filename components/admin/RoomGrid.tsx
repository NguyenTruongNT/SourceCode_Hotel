import { Room, RoomStatus, RoomType } from '@/app/admin/types';

interface RoomGridProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
}

export default function RoomGrid({ rooms, onSelectRoom }: RoomGridProps) {
  // Nhóm các phòng theo tầng bám sát cấu hình F5
  const floors = [
    { floor: 2, label: 'Tầng 2 - Phòng Standard (STD)', type: RoomType.STANDARD },
    { floor: 3, label: 'Tầng 3 - Phòng Superior (SUP)', type: RoomType.SUPERIOR },
    { floor: 4, label: 'Tầng 4 - Phòng Deluxe (DLX)', type: RoomType.DELUXE },
    { floor: 5, label: 'Tầng 5 - Phòng Suite Luxury (SUT)', type: RoomType.SUITE },
  ];

  const getStatusClasses = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.EMPTY:
        return 'bg-emerald-50/50 border border-emerald-200 hover:border-emerald-400 text-emerald-900';
      case RoomStatus.BOOKED:
        return 'bg-amber-50 border border-amber-300 hover:border-amber-400 text-amber-900';
      case RoomStatus.OCCUPIED:
        return 'bg-rose-50 border border-rose-300 hover:border-rose-400 text-rose-900';
      case RoomStatus.CLEANING:
        return 'bg-slate-100 border border-slate-300 hover:border-slate-400 text-slate-700';
      default:
        return 'bg-white border border-slate-200';
    }
  };

  const getSubText = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.EMPTY:
        return <span className="text-[10px] text-emerald-700 font-semibold">Trống - Sạch</span>;
      case RoomStatus.BOOKED:
        return <span className="text-[10px] text-amber-700 font-semibold">Đã cọc trước</span>;
      case RoomStatus.OCCUPIED:
        return <span className="text-[10px] text-rose-600 font-bold">Đang ở</span>;
      case RoomStatus.CLEANING:
        return <span className="text-[10px] text-slate-500 font-semibold">Chờ dọn (Dirty)</span>;
      default:
        return <span className="text-[10px] text-slate-400">Trống</span>;
    }
  };

  return (
    <div className="space-y-8">
      {floors.map((floorObj) => {
        const floorRooms = rooms.filter((r) => r.floor === floorObj.floor);
        return (
          <section key={floorObj.floor} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-3 tracking-tight flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-blue-600 rounded-sm"></span>
                {floorObj.label}
              </span>
              <span className="text-xs text-slate-400 font-normal">
                {floorRooms.filter(r => r.status === RoomStatus.EMPTY).length}/{floorRooms.length} phòng khả dụng
              </span>
            </h3>
            <div className="flex flex-wrap gap-3.5">
              {floorRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => onSelectRoom(room)}
                  className={`w-28 h-24 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:scale-95 ${getStatusClasses(
                    room.status
                  )}`}
                  title={`Phòng ${room.id} - Bấm để xem chi tiết hoặc giao phòng`}
                >
                  <span className="text-lg font-black tracking-tight font-mono">
                    {room.id}
                  </span>
                  <div className="mt-1 flex items-center space-x-1">
                    {room.status === RoomStatus.OCCUPIED && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    )}
                    {room.status === RoomStatus.BOOKED && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                    {room.status === RoomStatus.EMPTY && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
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
