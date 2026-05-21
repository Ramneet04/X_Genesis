import { useState, useRef, useEffect } from 'react';
import {
  Building2,
  Globe,
  FileUp,
  Text,
  CheckCircle,
  XCircle,
  UploadCloud
} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
      <OrganizationRegistrationForm />
    </div>
  );
}

const OrganizationRegistrationForm = () => {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState({ type: '', message: '' });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type.startsWith('image/')) {
        setLogo(selectedFile);
        setLogoPreview(URL.createObjectURL(selectedFile));
        setFormErrors(prev => ({ ...prev, logo: '' }));
      } else {
        setLogo(null);
        setLogoPreview(null);
        setFormErrors(prev => ({ ...prev, logo: 'Only image files are allowed.' }));
      }
    } else {
      setLogo(null);
      setLogoPreview(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Organization name is required.';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    setSubmissionMessage({ type: '', message: '' });

    const formData = new FormData();
    formData.append('name', name);
    formData.append('domain', domain);
    formData.append('description', description);
    if (logo) {
      formData.append('logo', logo);
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmissionMessage({ type: 'success', message: 'Organization registration simulated successfully!' });
      setName('');
      setDomain('');
      setDescription('');
      setLogo(null);
      setLogoPreview(null);
    } catch (error) {
      console.error('Error registering organization:', error);
      setSubmissionMessage({ type: 'error', message: 'An unexpected error occurred during registration.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  return (
    <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
      <h2 className="text-3xl font-extrabold text-white text-center mb-6">Register Your Organization</h2>
      <p className="text-center text-gray-300 mb-8">Fill out the form below to get your organization approved.</p>

      {submissionMessage.message && (
        <div
          className={`p-3 mb-4 rounded-lg flex items-center gap-2 ${
            submissionMessage.type === 'success'
              ? 'bg-green-700 text-green-100 border border-green-600'
              : 'bg-red-700 text-red-100 border border-red-600'
          }`}
          role="alert"
        >
          {submissionMessage.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span className="font-medium text-sm">{submissionMessage.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
            <Building2 className="inline-block mr-1 text-blue-400" size={16} /> Organization Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 block w-full px-4 py-2 border ${
              formErrors.name ? 'border-red-500' : 'border-gray-600'
            } bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            placeholder="e.g., Acme Corporation"
          />
          {formErrors.name && <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-200 mb-1">
            <Globe className="inline-block mr-1 text-purple-400" size={16} /> Domain (Optional)
          </label>
          <input
            type="text"
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., acmecorp.com"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
            <Text className="inline-block mr-1 text-green-400" size={16} /> Description (Optional)
          </label>
          <textarea
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
            placeholder="Tell us about your organization..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            <FileUp className="inline-block mr-1 text-orange-400" size={16} /> Organization Logo (Optional)
          </label>
          <div
            className={`mt-1 flex flex-col justify-center items-center px-6 pt-5 pb-6 border-2 ${
              isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600 border-dashed'
            } rounded-md transition-all cursor-pointer hover:border-blue-500`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <div className="text-center space-y-2">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="mx-auto h-20 w-20 object-cover rounded-full border border-gray-500"
                />
              ) : (
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div className="flex text-sm text-gray-400">
                <p className="pl-1">
                  {logo ? (
                    <span className="font-medium text-blue-400">{logo.name}</span>
                  ) : (
                    <>
                      <span className="font-medium text-blue-400 hover:text-blue-300">Upload a file</span> or drag and drop
                    </>
                  )}
                </p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              id="logo-upload"
              name="logo"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files)}
              ref={fileInputRef}
            />
          </div>
          {formErrors.logo && <p className="mt-1 text-xs text-red-400">{formErrors.logo}</p>}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 rounded-md text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            'Register Organization'
          )}
        </button>
      </form>
    </div>
  );
};
