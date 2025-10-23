import { Head, router, useForm } from "@inertiajs/react";
import PinterestLayout from "@/layouts/pinterest-layout";
import { useState, useEffect, FormEventHandler } from "react";
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
    canUpdate: boolean;
};

export default function Show({
    pin,
    boards,
    isLiked: isLikedProp,
    canUpdate,
}: Props) {
    const [selectedBoardId, setSelectedBoardId] = useState(boards[0]?.id || null);
    const [isLiked, setLiked] = useState(isLikedProp);
    const [likeCount, setLikeCount] = useState(pin.likes_count || 0);
    const [isLikeLoading, setLikeLoading] = useState(false);
    const [isSaveLoading, setSaveLoading] = useState(false);
    
    const [notification, setNotification] = useState<string | null>(null);
    const { flash } = usePage<{ flash?: { success?: string } }>().props;

    const [showEditModal, setShowEditModal] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        title: pin.title || "",
        description: pin.description || "",
    });

    useEffect(() => { setLiked(isLikedProp); }, [isLikedProp]);
    useEffect(() => { setLikeCount(pin.likes_count); }, [pin.likes_count]);

    useEffect(() => {
        setData({
            title: pin.title || "",
            description: pin.description || ""
        });
    }, [pin]);

    // Show notification when flash message exists
    useEffect(() => {
        if (flash?.success) {
            setNotification(flash.success);
        }
    }, [flash]);

    const handleLike = () => {
        if (isLikeLoading) return;
        setLikeLoading(true);
        router.post(`/pin/${pin.id}/like`, {}, {
            preserveScroll: true,
            only: ["pin", "isLiked"],
            onFinish: () => setLikeLoading(false),
        });
    };

    const handleSave = () => {
        if (isSaveLoading || !selectedBoardId) {
             if (!selectedBoardId) alert("Please select a board first.");
             return;
        }
        setSaveLoading(true);
        router.post(`/pin/${pin.id}/save`, { board_id: selectedBoardId }, {
            preserveScroll: true,
            onFinish: () => setSaveLoading(false),
        });
    };
    
    const handleClose = () => router.visit("/");

    const handleOpenEditModal = () => {
        reset(); 
        setShowEditModal(true);
    };

    const handleEditSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/pin/${pin.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditModal(false);
            },
        });
    };

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this pin? This action cannot be undone.")) {
            return;
        }
        router.delete(`/pin/${pin.id}`);
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
                    
                    {/* Top Buttons */}
                    <div className="flex justify-between items-center w-full">
                        {/* Back Button */}
                        <button
                            onClick={handleClose}
                            className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                            title="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        
                        {/* Right buttons */}
                        <div className="flex gap-2 items-center">
                            {/* Like button */}
                            <button
                                onClick={handleLike}
                                disabled={isLikeLoading}
                                className={`bg-white p-2 rounded-full border border-red-600 hover:bg-red-50 flex items-center justify-center ${isLikeLoading ? "opacity-50 cursor-wait" : ""}`}
                            >
                                {isLiked ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"/>
                                    </svg>
                                )}
                                <span className="ml-1 text-sm font-medium">{likeCount}</span>
                            </button>
                            
                            {/* Dropdown Board */}
                            <select
                                value={selectedBoardId || ""}
                                onChange={(e) => setSelectedBoardId(Number(e.target.value))}
                                className="font-sans bg-gray-200 hover:bg-gray-300 rounded-full px-4 py-2 text-sm font-semibold text-black"
                            >
                                {boards.length === 0 ? (
                                    <option value="" disabled>Buat board dulu</option>
                                ) : (
                                    !selectedBoardId && <option value="" disabled>Pilih board</option>
                                )}
                                {boards.map((board) => (
                                    <option key={board.id} value={board.id}>{board.name}</option>
                                ))}
                            </select>
                            
                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={isSaveLoading}
                                className={`px-4 py-2 rounded-full text-sm font-semibold bg-red-600 text-white hover:bg-red-700 ${isSaveLoading ? "opacity-50 cursor-wait" : ""}`}
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    {/* Image && Text */}
                    <div className="flex w-full gap-6">
                        {/* Image column */}
                        <div className="flex-1">
                            <img src={pin.image_url} alt={pin.title} className="w-full h-auto rounded-xl shadow-lg object-contain max-h-[90vh] mx-auto" />
                        </div>

                        {/* Info Column */}
                        <div className="flex-1 flex flex-col justify-start mt-4">
                            
                            {/* Profile & Edit button */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    {pin.user.avatar_url ? (
                                        <img src={pin.user.avatar_url} alt={pin.user.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                            {pin.user.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="font-semibold text-gray-800">{pin.user.name}</span>
                                </div>
                                
                                {/* Edit */}
                                {canUpdate && (
                                    <button
                                        onClick={handleOpenEditModal}
                                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                        title="Edit Pin"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Title && Description */}
                            <h1 className="text-2xl font-bold text-gray-800">{pin.title}</h1>
                            <p className="mt-2 text-gray-600 whitespace-pre-line">
                                {pin.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setShowEditModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Form */}
                        <form onSubmit={handleEditSubmit}>
                            {/* Header Modal */}
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-2xl font-bold">Edit Pin</h2>
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {/* Body Modal */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                                    />
                                    {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={5}
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                                    />
                                    {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                                </div>
                            </div>

                            {/* Footer Modal */}
                            <div className="flex justify-between items-center gap-4 p-6 border-t">
                                {/* Delete */}
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-gray-100 text-red-600 rounded-full text-sm font-semibold hover:bg-gray-200"
                                >
                                    Delete
                                </button>
                                {/* Cancel && Submit */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 bg-gray-200 rounded-full text-sm font-semibold hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit" // <-- Ini yang men-submit form
                                        disabled={processing}
                                        className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {processing ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        </form>
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