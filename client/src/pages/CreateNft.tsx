import type React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// Import icons (react-icons/io5 and lucide-react are good choices)
import { IoImageOutline, IoCubeOutline, IoAddCircleOutline } from "react-icons/io5";
import { FileUp } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router-dom for navigation

const CreateNfts: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate

  // --- State Management for form fields ---
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [category, setCategory] = useState<string>("Project");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [verifiedBy, setVerifiedBy] = useState<string>("Self");
  const [organization, setOrganization] = useState<string>(""); // For user-entered organization if not in list
  const [selectedOrgFromList, setSelectedOrgFromList] = useState<string>(""); // For selected organization from predefined list
  const [isSoulBound, setIsSoulBound] = useState<boolean>(false);
  // Removed submissionTime state as it will be handled by the backend
  const [forSale, setForSale] = useState<boolean>(false);
  const [price, setPrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("MATIC");
  const [visibility, setVisibility] = useState<string>("Public");
  const [contributors, setContributors] = useState([{ userId: '', role: '' }]);

  // Derived state for the actual organization value to send to backend
  const actualOrganizationValue = useMemo(() => {
    if (verifiedBy === "Organization/Institution") {
      // If a predefined organization is selected, use its ID.
      // Otherwise, use the manually entered organization name/ID.
      return selectedOrgFromList || organization;
    }
    return ""; // Not applicable for "Self" verified
  }, [verifiedBy, selectedOrgFromList, organization]);

  const addContributor = () => {
    setContributors([...contributors, { userId: '', role: '' }]);
  };

  const removeContributor = (index: number) => {
    const newContributors = contributors.filter((_, i) => i !== index);
    setContributors(newContributors);
  };

  // --- Data for Selects/Radios ---
  const categoriesOptions = ["Project", "Internship", "Certificate", "Hackathon", "Research Paper", "Open Source", "Resume", "Other"];
  const verifiedByOptions = ["Self", "Organization/Institution"];
  const visibilityOptions = ["Public", "Private", "Unlisted"];
  const currenciesOptions = ["MATIC", "ETH", "USDT", "DAI"];

  // Pre-defined organizations for dropdown
  const predefinedOrganizations = [
    { id: "org_innovatech_uni", name: "InnovateTech University" },
    { id: "org_global_blockchain", name: "Global Blockchain Institute" },
    { id: "org_quantum_solutions", name: "Quantum Solutions Corp." },
    { id: "org_open_source_collective", name: "Open Source Collective" },
    // Add more as needed
  ];

  // State for avatar category filter
  const [avatarFilterCategory, setAvatarFilterCategory] = useState<string>("All");

  // Placeholder for pre-defined avatars with categories
  const preDefinedAvatars = [
    { id: 1, src: `https://source.unsplash.com/random/80x80/?code,project`, alt: `Project Avatar 1`, category: "Project" },
    { id: 2, src: `https://source.unsplash.com/random/80x80/?learning,internship`, alt: `Internship Avatar 1`, category: "Internship" },
    { id: 3, src: `https://source.unsplash.com/random/80x80/?certificate,award`, alt: `Certificate Avatar 1`, category: "Certificate" },
    { id: 4, src: `https://source.unsplash.com/random/80x80/?hackathon,coding`, alt: `Hackathon Avatar 1`, category: "Hackathon" },
    { id: 5, src: `https://source.unsplash.com/random/80x80/?research,science`, alt: `Research Paper Avatar 1`, category: "Research Paper" },
    { id: 6, src: `https://source.unsplash.com/random/80x80/?opensource,github`, alt: `Open Source Avatar 1`, category: "Open Source" },
    { id: 7, src: `https://source.unsplash.com/random/80x80/?resume,profile`, alt: `Resume Avatar 1`, category: "Resume" },
    { id: 8, src: `https://source.unsplash.com/random/80x80/?abstract,geometric`, alt: `Other Avatar 1`, category: "Other" },
    { id: 9, src: `https://source.unsplash.com/random/80x80/?programming,development`, alt: `Project Avatar 2`, category: "Project" },
    { id: 10, src: `https://source.unsplash.com/random/80x80/?business,meeting`, alt: `Internship Avatar 2`, category: "Internship" },
    // Add more avatars with categories
  ];
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(preDefinedAvatars[0]?.id || null);

  const filteredAvatars = useMemo(() => {
    if (avatarFilterCategory === "All") {
      return preDefinedAvatars;
    }
    return preDefinedAvatars.filter(avatar => avatar.category === avatarFilterCategory);
  }, [avatarFilterCategory, preDefinedAvatars]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const baseNftData = {
      title, description, tags, category, fileUrl,
      verifiedBy,
      organization: actualOrganizationValue, // Use the derived value
      isSoulBound, contributors, visibility,
      forSale, price, currency, selectedAvatar,
    };

    try {
      if (verifiedBy === "Self") {
        const nftData = {
          ...baseNftData,
          // mintedAt will be set by the backend using Date.now()
        };
        console.log("Attempting direct mint (Self-verified):", nftData);
        // Simulate API call to your backend to directly mint
        const response = await fetch('/api/mint-nft-self', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nftData) });
        const result = await response.json();
        // Assuming backend returns transaction hash or direct NFT ID
        // const mockResponse = { success: true, transactionHash: "0xabc123...", nftId: "mock_self_nft_123" }; // Mock data
        if (result.success) {
          alert("NFT creation initiated! Check console for transaction hash.");
          navigate(`/nft-status/${result.transactionHash || result.nftId}`); // Redirect to status page
        } else {
          alert(`Failed to create NFT: ${result.message || 'Unknown error'}`);
        }
      } else { // Organization/Institution
        const nftRequestData = {
          ...baseNftData,
          // requestedAt will be set by the backend using Date.now()
        };
        console.log("Submitting NFT request for organization approval:", nftRequestData);
        // Simulate API call to your backend to submit for approval
        const response = await fetch('/api/submit-nft-for-approval', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nftRequestData) });
        const result = await response.json();
        // Assuming backend returns a requestId
        // const mockResponse = { success: true, requestId: "req_org_xyz_456" }; // Mock data
        if (result.success) {
          alert("NFT creation request submitted for organization approval!");
          navigate(`/my-requests/${result.requestId}`); // Redirect to a page showing pending requests
        } else {
          alert(`Failed to submit request: ${result.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error("Error in NFT process:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-zinc-900 text-gray-100 font-sans p-6 relative overflow-hidden">
      {/* Background radial gradients for subtle color and depth */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(circle at 10% 10%, rgba(144,202,249,0.1) 0%, transparent 50%), /* Lighter Blue */
          radial-gradient(circle at 90% 20%, rgba(189,147,249,0.1) 0%, transparent 50%), /* Lighter Purple */
          radial-gradient(circle at 50% 90%, rgba(255,160,201,0.1) 0%, transparent 50%)  /* Lighter Pink */
        `
      }}></div>

      {/* Main Content Area: Sidebar + Form */}
      <div className="relative z-10 flex mt-8 max-w-7xl mx-auto">
        {/* Left Sidebar (Icon based) */}
        <aside className="w-16 flex flex-col items-center py-8 space-y-8 bg-slate-900 rounded-xl shadow-lg shadow-black/30 mr-8 border border-gray-600">
          <Button variant="ghost" className="text-blue-400 hover:text-white p-3 rounded-md transition-all duration-300 bg-blue-700/20">
            <IoCubeOutline className="h-7 w-7" /> {/* Current selected "Create NFT" icon */}
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white p-3 rounded-md transition-all duration-300">
            <IoImageOutline className="h-7 w-7" />
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white p-3 rounded-md transition-all duration-300">
            <FileUp className="h-7 w-7" />
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white p-3 rounded-md transition-all duration-300">
            <FileUp className="h-7 w-7" />
          </Button>
          {/* Add more icons as needed for navigation */}
        </aside>

        {/* Create NFT Form Card */}
        <Card className="flex-1 bg-slate-900 border border-gray-600 rounded-xl p-10 shadow-2xl shadow-purple-700/30 relative z-10">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-sky-400 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
  Create NFT
</h1>


          <form onSubmit={handleSubmit} id="nft-form" className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Left Form Section */}
            <div className="space-y-8">
              <div>
                <Label htmlFor="title" className="text-gray-300 mb-2 block">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Certified Blockchain Developer"
                  className="bg-slate-950 border-gray-500 text-white focus-visible:ring-blue-400 focus-visible:ring-offset-0 focus-visible:border-blue-400 shadow-md shadow-black/20 rounded-2xl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300 mb-2 block">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A brief description of your NFT"
                  className="bg-slate-950 rounded-2xl border-gray-500 text-white focus-visible:ring-blue-400 focus-visible:ring-offset-0 focus-visible:border-blue-400 shadow-md shadow-black/20"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tags" className="text-gray-300 mb-2 block">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., Web3, Solidity, DeFi, AI"
                  className="bg-slate-950 rounded-2xl border-gray-500 text-white focus-visible:ring-blue-400 focus-visible:ring-offset-0 focus-visible:border-blue-400 shadow-md shadow-black/20"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-300 mb-2 block">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-slate-950 rounded-2xl border-gray-500 text-white focus-visible:ring-blue-400 focus-visible:ring-offset-0 shadow-md shadow-black/20">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 rounded-2xl border-gray-500 text-white">
                    {categoriesOptions.map((cat) => (
                      <SelectItem key={cat} value={cat} className="hover:bg-slate-900 focus:bg-blue-500 focus:text-white data-[state=checked]:bg-blue-500 data-[state=checked]:text-white">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fileUrl" className="text-gray-300 mb-2 block">NFT Asset File URL</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="fileUrl"
                    placeholder="Paste IPFS or direct URL for image/video"
                    className="flex-grow rounded-2xl bg-slate-950 border-gray-500 text-white focus-visible:ring-blue-400 focus-visible:ring-offset-0 focus-visible:border-blue-400 shadow-md shadow-black/20"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    required
                  />
                  <Button type="button" className="shrink-0 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-2 rounded-md shadow-lg shadow-blue-400/30">
                    <FileUp className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">Verified By</Label>
                <RadioGroup value={verifiedBy} onValueChange={setVerifiedBy} className="flex flex-wrap gap-4">
                  {verifiedByOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`verified-by-${option}`} className="data-[state=checked]:bg-blue-400 data-[state=checked]:text-white data-[state=checked]:border-blue-400" />
                      <Label htmlFor={`verified-by-${option}`} className="text-gray-400 hover:text-white cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>

                {verifiedBy === "Organization/Institution" && (
                  <div className="mt-4">
                    <Label htmlFor="organization-select" className="text-gray-300 mb-2 block">Select Organization</Label>
                    <Select value={selectedOrgFromList} onValueChange={setSelectedOrgFromList}>
                      <SelectTrigger id="organization-select" className="bg-slate-950 rounded-2xl border-gray-500 text-white focus-visible:ring-blue-400 focus-visible:ring-offset-0 shadow-md shadow-black/20">
                        <SelectValue placeholder="Choose an organization (or enter new below)" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 rounded-2xl border-gray-500 text-white">
                        {predefinedOrganizations.map((org) => (
                          <SelectItem key={org.id} value={org.id} className="hover:bg-zinc-500 focus:bg-blue-500 focus:text-white data-[state=checked]:bg-blue-500 data-[state=checked]:text-white">
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-2">Or, if not listed, enter organization details below:</p>
                    <Input
                      id="organization"
                      placeholder="Enter new Organization Name or Wallet Address"
                      className="bg-slate-950 rounded-2xl border-gray-500 text-white focus-visible:ring-blue-400 focus-visible:ring-offset-0 focus-visible:border-blue-400 shadow-md shadow-black/20 mt-2"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      required={!selectedOrgFromList} // Make required if no pre-selected org
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Form Section */}
            <div className="space-y-8">
              <div>
                <Label className="text-gray-300 mb-2 block">Pre-Defined NFT Avatars</Label>
                <Select value={avatarFilterCategory} onValueChange={setAvatarFilterCategory}>
                  <SelectTrigger className="bg-slate-950 rounded-2xl border-gray-500 text-white focus-visible:ring-blue-400 focus-visible:ring-offset-0 shadow-md shadow-black/20 mb-4">
                    <SelectValue placeholder="Filter avatars by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 rounded-2xl border-gray-500 text-white">
                    <SelectItem value="All" className="hover:bg-zinc-500 focus:bg-blue-500 focus:text-white data-[state=checked]:bg-blue-500 data-[state=checked]:text-white">All Categories</SelectItem>
                    {categoriesOptions.map((cat) => (
                      <SelectItem key={`avatar-filter-${cat}`} value={cat} className="hover:bg-zinc-500 focus:bg-blue-500 focus:text-white data-[state=checked]:bg-blue-500 data-[state=checked]:text-white">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-slate-950 border border-gray-500 shadow-inner shadow-black/30 max-h-80 overflow-y-auto custom-scrollbar">
                  {filteredAvatars.length > 0 ? (
                    filteredAvatars.map((avatar) => (
                      <div
                        key={avatar.id}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-200
                          ${selectedAvatar === avatar.id ? 'ring-2 ring-offset-2 ring-offset-zinc-600 ring-blue-400 shadow-lg shadow-blue-400/40 animate-pulse-border' : 'hover:ring-1 hover:ring-gray-500'}
                        `}
                        onClick={() => setSelectedAvatar(avatar.id)}
                      >
                        <img src={avatar.src} alt={avatar.alt} className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <p className="col-span-4 text-center text-gray-400">No avatars found for this category.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-950 border border-gray-500 shadow-md shadow-black/20">
                <Label htmlFor="isSoulBound" className="text-gray-300 text-base font-medium">Is Soulbound (Non-transferable)</Label>
                <Switch
                  id="isSoulBound"
                  checked={isSoulBound}
                  onCheckedChange={setIsSoulBound}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500 data-[state=unchecked]:bg-gray-500"
                />
              </div>

              {/* Date/Time input and label completely removed as per your request */}
              {/* This section used to display "Minting Date & Time" or "Requested Date & Time" */}

              <div>
                <Label className="text-gray-300 mb-2 block">Contributors</Label>
                {contributors.map((contributor, index) => (
                  <div key={index} className="flex space-x-2 mb-2 items-center">
                    <Input
                      placeholder="Contributor User ID/Address"
                      value={contributor.userId}
                      onChange={(e) => {
                        const newCont = [...contributors];
                        newCont[index].userId = e.target.value;
                        setContributors(newCont);
                      }}
                      className="flex-grow rounded-2xl bg-slate-950 border-gray-500 text-white shadow-md shadow-black/20"
                    />
                    <Input
                      placeholder="Role (e.g., Developer, Designer)"
                      value={contributor.role}
                      onChange={(e) => {
                        const newCont = [...contributors];
                        newCont[index].role = e.target.value;
                        setContributors(newCont);
                      }}
                      className="flex-grow rounded-2xl bg-slate-950 border-gray-500 text-white shadow-md shadow-black/20"
                    />
                    {contributors.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeContributor(index)} className="text-red-400 hover:text-red-300">
                        <IoAddCircleOutline className="h-5 w-5 rotate-45" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={addContributor} className="mt-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 shadow-lg shadow-purple-400/30">
                  <IoAddCircleOutline className="mr-2 h-5 w-5" /> Add Contributor
                </Button>
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">Visibility Settings</Label>
                <RadioGroup value={visibility} onValueChange={setVisibility} className="flex flex-wrap gap-4 p-2 rounded-2xl bg-slate-950 border border-gray-500 shadow-md shadow-black/20">
                  {visibilityOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`visibility-${option}`} className="data-[state=checked]:bg-blue-400 data-[state=checked]:text-white data-[state=checked]:border-blue-400" />
                      <Label htmlFor={`visibility-${option}`} className="text-gray-400 hover:text-white cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-950 border border-gray-500 shadow-md shadow-black/20">
                <Label htmlFor="forSale" className="text-gray-300 text-base font-medium">List for Sale</Label>
                <Switch
                  id="forSale"
                  checked={forSale}
                  onCheckedChange={setForSale}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-teal-500 data-[state=unchecked]:bg-gray-500"
                />
              </div>

              {forSale && (
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="price" className="text-gray-300 mb-2 block">Sale Price</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g., 1500"
                      className="bg-slate-950 border-gray-500 text-white focus-visible:ring-blue-400 focus-visible:ring-offset-0 focus-visible:border-blue-400 shadow-md shadow-black/20"
                      value={price ?? ''}
                      onChange={(e) => setPrice(parseFloat(e.target.value) || null)}
                      min="0"
                      step="0.01"
                      required={forSale}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="currency" className="text-gray-300 mb-2 block">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency" className="bg-slate-950 border-gray-500 text-white focus-visible:ring-blue-400 focus-visible:ring-offset-0 shadow-md shadow-black/20">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-gray-500 text-white">
                        {currenciesOptions.map((curr) => (
                          <SelectItem key={curr} value={curr} className="hover:bg-zinc-500 focus:bg-blue-500 focus:text-white data-[state=checked]:bg-blue-500 data-[state=checked]:text-white">
                            {curr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Action Buttons at bottom */}
          <div className="flex justify-end space-x-4 mt-12 pt-8 border-t border-gray-600">
            <Button type="submit" form="nft-form" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-md px-8 py-3 text-lg shadow-xl shadow-blue-700/40 transition-all duration-300 transform hover:scale-105">
              {verifiedBy === "Self" ? "Create NFT" : "Submit for Approval"}
            </Button>
            <Button type="button" variant="outline" className="text-gray-300 border-gray-500 hover:border-gray-300 hover:text-white font-bold rounded-md px-8 py-3 text-lg shadow-xl shadow-white/10 transition-all duration-300 transform hover:scale-105">
              Preview
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateNfts;