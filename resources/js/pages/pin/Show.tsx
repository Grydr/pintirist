import { Head, router, usePage } from "@inertiajs/react";
import PinterestLayout from "@/layouts/pinterest-layout";
import { useState, useEffect } from "react";
import Notification from "../../components/Notification";

type User = {
    id: number;
    name: string;
    avatar_url?: string;
};

type Board = {
    id: number;
    name: string;
};

type Pin = {
    id: number;
    title: string;
    description: string;
    image_url: string;
    likes_count: number;
    user: User;
};

type Props = {
    pin: Pin;
    boards: Board[];
    isLiked: boolean; 
};

export default function Show({ pin, boards, isLiked: isLikedProp }: Props) {
    const [selectedBoardId, setSelectedBoardId] = useState(boards[0]?.id || null);

    const [isLiked, setLiked] = useState(isLikedProp);
    const [likeCount, setLikeCount] = useState(pin.likes_count || 0);
    const [isLikeLoading, setLikeLoading] = useState(false);

    const [isSaveLoading, setSaveLoading] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const { flash } = usePage<{ flash?: { success?: string } }>().props;

    useEffect(() => {
        setLiked(isLikedProp);
    }, [isLikedProp]);

    useEffect(() => {
        setLikeCount(pin.likes_count || 0);
    }, [pin.likes_count]);

    // Show notification when flash message exists
    useEffect(() => {
        if (flash?.success) {
            setNotification(flash.success);
        }
    }, [flash]);

    const handleLike = () => {
        if (isLikeLoading) return; 
        setLikeLoading(true);

        router.post(
            `/pins/${pin.id}/like`,
            {},
            {
                preserveScroll: true,
                only: ["pin", "isLiked"],
                onFinish: () => {
                    setLikeLoading(false); 
                },
            }
        );
    };

    const handleSave = () => {
        if (isSaveLoading) return;  

        if (!selectedBoardId) {
            alert("Please select a board first.");
            return;
        }

        setSaveLoading(true);

        router.post(
            `/pin/${pin.id}/save`, 
            {
                board_id: selectedBoardId,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setSaveLoading(false);
                },
            }
        );
    };

    const handleClose = () => {
        // Simply go back to previous page
        // This works whether coming from dashboard, board detail, or anywhere else
        window.history.back();
    };

    return (
        <PinterestLayout active="pins">
            <Head title={pin.title || "Pin"} />

            <div className="flex justify-center bg-gray-50 min-h-screen p-6">
                <div className="flex flex-col max-w-6xl w-full gap-4">
                    {/* Top buttons */}
                    <div className="flex justify-between items-center w-full">
                        {/* --- Back button --- */}
                        <button
                            onClick={handleClose}
                            className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                            title="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        {/* --- Right button group --- */}
                        <div className="flex gap-2 items-center">
                            {/* Like */}
                            <button
                                onClick={handleLike}
                                disabled={isLikeLoading}
                                className={`bg-white p-2 rounded-full border border-red-600 hover:bg-red-50 flex items-center justify-center
                                    ${
                                        isLikeLoading
                                            ? "opacity-50 cursor-wait"
                                            : ""
                                    }
                                `}
                            >
                                {isLiked ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-red-600"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-red-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                                        />
                                    </svg>
                                )}
                                <span className="ml-1 text-sm font-medium">
                                    {likeCount}
                                </span>
                            </button>

                            {/* Dropdown Board */}
                            <select
                                value={selectedBoardId || ""}
                                onChange={(e) =>
                                    setSelectedBoardId(Number(e.target.value))
                                }
                                className="font-sans bg-gray-200 hover:bg-gray-300 rounded-full px-4 py-2 text-sm font-semibold text-black"
                            >
                                {boards.length === 0 ? (
                                    <option value="" disabled>
                                        Buat board dulu
                                    </option>
                                ) : (
                                    !selectedBoardId && (
                                        <option value="" disabled>
                                            Pilih board
                                        </option>
                                    )
                                )}
                                {boards.map((board) => (
                                    <option key={board.id} value={board.id}>
                                        {board.name}
                                    </option>
                                ))}
                            </select>

                            {/* Save */}
                            <button
                                onClick={handleSave}
                                disabled={isSaveLoading}
                                className={`px-4 py-2 rounded-full text-sm font-semibold bg-red-600 text-white hover:bg-red-700
                                    ${
                                        isSaveLoading
                                            ? "opacity-50 cursor-wait"
                                            : ""
                                    }
                                `}
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    <div className="flex w-full gap-6">
                        {/* Image */}
                        <div className="flex-1">
                            <img
                                src={pin.image_url}
                                alt={pin.title}
                                className="w-full h-auto rounded-xl shadow-lg object-contain max-h-[90vh] mx-auto"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-start mt-4">
                            {/* Profile */}
                            <div className="flex items-center mb-4">
                                <div className="flex items-center gap-2">
                                    {pin.user.avatar_url ? (
                                        <img
                                            src={pin.user.avatar_url}
                                            alt={pin.user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                            {pin.user.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}
                                    <span className="font-semibold text-gray-800">
                                        {pin.user.name}
                                    </span>
                                </div>
                            </div>

                            {/* Title & Description */}
                            <h1 className="text-2xl font-bold text-gray-800">
                                {pin.title}
                            </h1>
                            <p className="mt-2 text-gray-600">
                                {pin.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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