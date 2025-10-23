import { Head } from "@inertiajs/react";
import { useState } from "react";
import PinterestLayout from "@/layouts/pinterest-layout";
import CreateBoardModal from "./CreateBoardModal";
import BoardCard from "./BoardCard";

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

interface BoardsIndexProps {
    boards: {
        data: Board[];
    };
}

export default function Index({ boards }: BoardsIndexProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const boardsList = boards.data || [];

    return (
        <PinterestLayout active="boards">
            <Head title="Your Boards" />

            <div className="min-h-screen">
                {/* Header */}
                <div className="px-10 pt-10 pb-8 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-4xl font-bold text-gray-900">
                            Your boards
                        </h1>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition flex items-center gap-2"
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
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Create board
                        </button>
                    </div>

                    <p className="text-gray-600 text-lg">
                        {boardsList.length}{" "}
                        {boardsList.length === 1 ? "board" : "boards"}
                    </p>
                </div>

                {/* Content */}
                <div className="px-10 py-10">
                    {boardsList.length === 0 ? (
                        // Empty State
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                            <div className="mb-6">
                                <svg
                                    className="w-32 h-32 text-gray-300 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Organize your ideas
                            </h2>
                            <p className="text-gray-600 max-w-md mb-8 text-lg">
                                Pins are sparks of inspiration. Boards are where
                                they live. Create boards to organize your Pins
                                your way.
                            </p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-red-600 text-white px-8 py-3 rounded-full font-medium hover:bg-red-700 transition text-lg"
                            >
                                Create your first board
                            </button>
                        </div>
                    ) : (
                        // Boards Grid
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
                            {boardsList.map((board) => (
                                <BoardCard key={board.id} board={board} />
                            ))}

                            {/* Create board card */}
                            <div
                                onClick={() => setShowCreateModal(true)}
                                className="aspect-[3/2] rounded-2xl bg-gray-100 hover:bg-gray-200 cursor-pointer transition flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300"
                            >
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-gray-700"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                </div>
                                <span className="text-gray-700 font-medium text-lg">
                                    Create board
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Board Modal */}
            {showCreateModal && (
                <CreateBoardModal onClose={() => setShowCreateModal(false)} />
            )}
        </PinterestLayout>
    );
}
