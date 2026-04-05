import React from 'react';

interface ReflectionBoxProps {
    value: string;
    onChange: (text: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
    isDisabled: boolean;
}

export const ReflectionBox: React.FC<ReflectionBoxProps> = ({
    value,
    onChange,
    onSubmit,
    isLoading,
    isDisabled
}) => {
    return (
        <div className="w-full flex flex-col gap-4 mt-8">
            <h3 className="text-lg font-semibold text-gray-800">Daily Reflection</h3>
            <p className="text-sm text-gray-600">
                Write down what's on your mind. Our AI will help you process these thoughts objectively.
            </p>
            <textarea
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow min-h-[150px] resize-y text-gray-800"
                placeholder="I feel this way because..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
            />
            <div className="flex justify-end">
                <button
                    onClick={onSubmit}
                    disabled={isDisabled || isLoading || value.trim() === ''}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-200
                        ${(isDisabled || value.trim() === '') 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </span>
                    ) : 'Get Insight'}
                </button>
            </div>
        </div>
    );
};
