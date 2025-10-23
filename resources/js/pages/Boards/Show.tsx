import { Head, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import PinterestLayout from "@/layouts/pinterest-layout";
import Notification from "../../components/Notification";

interface Pin {
    id: number;
    image_url: string;
    title: string;
    description: string | null;
    user_id: number;
    created_at: string;
}

interface Board {
    id: number;
    name: string;
    description: string | null;
    pins_count: number;
    pins: Pin[];
    created_at: string;
}

interface ShowProps {
    board: {
        data: Board;
    };
    availablePins?: {
        data: Pin[];
    };
}

export default function Show({ board, availablePins }: ShowProps) {
    const boardData = board.data;
    const [showAddPinModal, setShowAddPinModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [notification, setNotification] = useState<string | null>(null);
    const { flash } = usePage().props as any;

    // Show notification when flash message exists
    useEffect(() => {
        if (flash?.success) {
            setNotification(flash.success);
        }
    }, [flash]);

    const handleRemovePin = (pinId: number) => {
        if (confirm("Remove this pin from board?")) {
            router.delete(`/api/boards/${boardData.id}/pins/${pinId}`);
        }
    };

    const handleAddPin = (pinId: number) => {
        router.post(`/api/boards/${boardData.id}/pins`, {
            pin_id: pinId,
        }, {
            onSuccess: () => {
                setShowAddPinModal(false);
            },
        });
    };

    const filteredPins = availablePins?.data.filter(
        (pin) =>
            !boardData.pins.some((boardPin) => boardPin.id === pin.id) &&
            (pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pin.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <PinterestLayout active="boards">
            <Head title={boardData.name} />

            <div className="min-h-screen">
                {/* Header */}
                <div className="px-10 pt-10 pb-8 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                {boardData.name}
                            </h1>
                            {boardData.description && (
                                <p className="text-gray-600 text-lg">
                                    {boardData.description}
                                </p>
                            )}
                            <p className="text-gray-500 mt-2">
                                {boardData.pins_count}{" "}
                                {boardData.pins_count === 1 ? "Pin" : "Pins"}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddPinModal(true)}
                                className="bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition"
                            >
                                Add pins
                            </button>
                            <button
                                onClick={() => router.visit("/boards")}
                                className="bg-gray-200 text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-300 transition"
                            >
                                Back to boards
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pins Grid */}
                <div className="px-10 py-10">
                    {boardData.pins.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                            <svg
                                className="w-32 h-32 text-gray-300 mb-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                            </svg>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                No pins yet
                            </h2>
                            <p className="text-gray-600 text-lg mb-8">
                                Add pins to organize your ideas
                            </p>
                            <button
                                onClick={() => setShowAddPinModal(true)}
                                className="bg-red-600 text-white px-8 py-3 rounded-full font-medium hover:bg-red-700 transition"
                            >
                                Add your first pin
                            </button>
                        </div>
                    ) : (
                        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6">
                            {boardData.pins.map((pin) => (
                                <div
                                    key={pin.id}
                                    className="mb-6 break-inside-avoid group relative"
                                >
                                    <div className="relative rounded-2xl overflow-hidden">
                                        <img
                                            src={pin.image_url}
                                            alt={pin.title}
                                            className="w-full h-auto"
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() =>
                                                    handleRemovePin(pin.id)
                                                }
                                                className="absolute top-3 right-3 bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <h3 className="font-semibold text-gray-900">
                                            {pin.title}
                                        </h3>
                                        {pin.description && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {pin.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Pin Modal */}
            {showAddPinModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setShowAddPinModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">
                                    Add pins to board
                                </h2>
                                <button
                                    onClick={() => setShowAddPinModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Search pins..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
                            />
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {filteredPins && filteredPins.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {filteredPins.map((pin) => (
                                        <div
                                            key={pin.id}
                                            onClick={() => handleAddPin(pin.id)}
                                            className="cursor-pointer group"
                                        >
                                            <div className="relative rounded-xl overflow-hidden">
                                                <img
                                                    src={pin.image_url}
                                                    alt={pin.title}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                    <div className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Add
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 className="mt-2 font-medium text-sm truncate">
                                                {pin.title}
                                            </h3>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    No pins available to add
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Notification */}
            {notification && (
                <Notification
                    message={notification}
                    onClose={() => setNotification(null)}
                />
            )}
        </PinterestLayout>
    );
}
