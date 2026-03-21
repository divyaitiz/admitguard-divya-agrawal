import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Upload, FileText, X } from "lucide-react";
import { useForm } from "../context/FormContext";
import { useState } from "react";

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step4DocumentUpload({ onNext, onBack }: Step4Props) {
  const { formData, updateField } = useForm();
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = files.map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      updateField("documents", [...formData.documents, ...files]);
      updateField("documentNames", [...formData.documentNames, ...files.map((f) => f.name)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    updateField(
      "documents",
      formData.documents.filter((_, i) => i !== index)
    );
    updateField(
      "documentNames",
      formData.documentNames.filter((_, i) => i !== index)
    );
  };
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Academic Documents Upload</h2>

      <div className="space-y-6">
        <div>
          <Label>Degree Certificate *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer mt-2">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, "degree")}
              className="hidden"
              id="degree-upload"
            />
            <label htmlFor="degree-upload" className="cursor-pointer block">
              <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Upload Degree Certificate</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
            </label>
          </div>
        </div>

        <div>
          <Label>Secondary Education Marksheet (10th) *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer mt-2">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, "10th")}
              className="hidden"
              id="10th-upload"
            />
            <label htmlFor="10th-upload" className="cursor-pointer block">
              <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Upload 10th Marksheet</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
            </label>
          </div>
        </div>

        <div>
          <Label>Higher Secondary Education Marksheet (12th) *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer mt-2">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, "12th")}
              className="hidden"
              id="12th-upload"
            />
            <label htmlFor="12th-upload" className="cursor-pointer block">
              <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Upload 12th Marksheet</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
            </label>
          </div>
        </div>

        <div>
          <Label>Under-graduation Marksheets *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer mt-2">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, "ug")}
              className="hidden"
              id="ug-upload"
            />
            <label htmlFor="ug-upload" className="cursor-pointer block">
              <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Upload All Semester Marksheets</p>
              <p className="text-xs text-gray-400 mt-1">Multiple files accepted (PDF, JPG, PNG - Max 5MB each)</p>
            </label>
          </div>

          {/* Uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <Button onClick={onNext} className="px-8">
            Next: AI Validation
          </Button>
        </div>
      </div>
    </div>
  );
}
