import React, { useState } from 'react';
import { Upload, Calendar, Clock, AlertCircle } from 'lucide-react';

export default function TimetableUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            // Simulate upload delay
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log('File uploaded:', selectedFile.name);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-8 space-y-8">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Publish Timetable</h1>
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                    View All Timetables
                </button>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 border rounded-lg space-y-4">
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <h2 className="text-xl font-semibold">Upload Timetable</h2>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="timetable" className="block text-sm font-medium text-gray-700">
                            Select Timetable Image
                        </label>
                        <input
                            id="timetable"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Semester</label>
                        <select className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option>Select Semester</option>
                            <option>Semester 1</option>
                            <option>Semester 2</option>
                            <option>Semester 3</option>
                            <option>Semester 4</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option>Select Department</option>
                            <option>Computer Science</option>
                            <option>Information Technology</option>
                            <option>Electronics</option>
                        </select>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className={`w-full px-4 py-2 text-white rounded-md ${uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        {uploading ? (
                            <span className="flex items-center justify-center space-x-2">
                                <Clock className="h-4 w-4 animate-spin" />
                                <span>Uploading...</span>
                            </span>
                        ) : (
                            <span className="flex items-center justify-center space-x-2">
                                <Upload className="h-4 w-4" />
                                <span>Upload Timetable</span>
                            </span>
                        )}
                    </button>
                </div>

                <div className="p-6 border rounded-lg space-y-4">
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-blue-500" />
                        <h2 className="text-xl font-semibold">Preview</h2>
                    </div>

                    {preview ? (
                        <div className="relative aspect-video border rounded-lg overflow-hidden">
                            <img
                                src={preview}
                                alt="Timetable preview"
                                className="object-contain w-full h-full"
                            />
                        </div>
                    ) : (
                        <div className="p-4 border rounded-md bg-yellow-50 text-yellow-800">
                            <h3 className="text-sm font-semibold">No preview available</h3>
                            <p className="text-sm">Select a timetable image to see a preview here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
