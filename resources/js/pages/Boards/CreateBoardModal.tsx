import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface CreateBoardModalProps {
    onClose: () => void;
}

export default function CreateBoardModal({ onClose }: CreateBoardModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post("/api/boards", {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-[540px] p-8 relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
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

                <h2 className="text-2xl font-bold text-center mb-8">
                    Create board
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Name field */}
                    <div>
                        <label className="block text-sm mb-2 font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder='Like "Places to Go" or "Recipes to Make"'
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none transition"
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description field */}
                    <div>
                        <label className="block text-sm mb-2 font-medium text-gray-700">
                            Description{" "}
                            <span className="text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            placeholder="What's your board about?"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none transition resize-none"
                            rows={3}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-full text-gray-700 font-medium hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !data.name.trim()}
                            className="px-6 py-2.5 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                        >
                            {processing ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
