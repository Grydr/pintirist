import { router } from "@inertiajs/react";
import { useState } from "react";

interface Board {
    id: number;
    name: string;
    description: string | null;
    pins_count: number;
    pins?: Array<{
        id: number;
        image_url: string;
        title: string;
    }>;
    created_at: string;
}

interface BoardCardProps {
    board: Board;
}

export default function BoardCard({ board }: BoardCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Get cover images (up to 4 pins for grid display)
    const coverPins = board.pins?.slice(0, 4) || [];
    const hasPins = coverPins.length > 0;

    const handleDelete = () => {
        router.delete(`/api/boards/${board.id}`, {
            onSuccess: () => {
                setShowDeleteConfirm(false);
            },
        });
    };

    const handleClick = () => {
        router.visit(`/boards/${board.id}`);
    };

    return (
        <>
            <div className="group relative">
                {/* Board Cover */}
                <div
                    onClick={handleClick}
                    className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden cursor-pointer bg-gray-100"
                >
                    {hasPins ? (
                        <div className="grid grid-cols-2 gap-0.5 h-full">
                            {coverPins.map((pin, index) => (
                                <div
                                    key={pin.id}
                                    className={`relative overflow-hidden ${
                                        coverPins.length === 1
                                            ? "col-span-2"
                                            : coverPins.length === 3 && index === 0
                                            ? "col-span-2"
                                            : ""
                                    }`}
                                >
                                    <img
                                        src={pin.image_url}
                                        alt={pin.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <svg
                                className="w-16 h-16 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-medium hover:bg-gray-100 transition">
                            Open
                        </button>
                    </div>
                </div>

                {/* Board Info */}
                <div className="mt-3 flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {board.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {board.pins_count}{" "}
                            {board.pins_count === 1 ? "Pin" : "Pins"}
                        </p>
                    </div>

                    {/* More menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-20 py-2 border border-gray-200">
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            setShowDeleteConfirm(true);
                                        }}
                                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-gray-50 transition"
                                    >
                                        Delete board
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold mb-2">
                            Delete this board?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            All pins will be permanently removed. This action
                            cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-5 py-2.5 rounded-full text-gray-700 font-medium hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2.5 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
