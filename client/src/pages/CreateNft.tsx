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
import { FileUp } from "lucide-react"; // Using FileUp instead of FileUp, FileUp for modern profile
import { useState } from "react";

const CreateNfts: React.FC = () => {
  // --- State Management for form fields ---
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [category, setCategory] = useState<string>("Project");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [metadataUrl, setMetadataUrl] = useState<string>("");
  const [verifiedBy, setVerifiedBy] = useState<string>("Self");
  const [organization, setOrganization] = useState<string>("");
  const [isSoulBound, setIsSoulBound] = useState<boolean>(false);
  // Token ID will be genuinely auto-generated on the backend, display a placeholder
  const [tokenId, setTokenId] = useState<string>("Auto-Generated on Mint");
  // Set default mintedAt to current local datetime string for input type="datetime-local"
  const [mintedAt, setMintedAt] = useState<string>(new Date().toISOString().slice(0, 16));
  const [forSale, setForSale] = useState<boolean>(false);
  const [price, setPrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("MATIC");
  const [visibility, setVisibility] = useState<string>("Public");

  // Dynamic contributors field
  const [contributors, setContributors] = useState([{ userId: '', role: '' }]);

  const addContributor = () => {
    setContributors([...contributors, { userId: '', role: '' }]);
  };

  const removeContributor = (index: number) => {
    const newContributors = contributors.filter((_, i) => i !== index);
    setContributors(newContributors);
  };

  // --- Data for Selects/Radios ---
  const categoriesOptions = ["Project", "Internship", "Certificate", "Hackathon", "Research Paper", "Other"];
  const verifiedByOptions = ["Self", "AI", "Institute", "Community", "Both"];
  const visibilityOptions = ["Public", "Private", "Unlisted"];
  const currenciesOptions = ["MATIC", "ETH", "USDT", "DAI"];

  // Placeholder for pre-defined avatars (using Unsplash Source for varied images)
  const preDefinedAvatars = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    src: `https://source.unsplash.com/random/80x80/?abstract,geometric,${i}`,
    alt: `Avatar ${i + 1}`,
  }));
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(preDefinedAvatars[0].id); // Default selected

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you'd send this data to your backend/smart contract
    console.log("NFT Data Submitted:", {
      title, description, tags, category, fileUrl, metadataUrl, verifiedBy,
      organization, isSoulBound, tokenId, mintedAt, contributors, visibility,
      forSale, price, currency, selectedAvatar
    });
    // Add actual logic to mint NFT here, e.g., via a Web3 library (ethers.js, web3.js)
    alert("NFT creation initiated! (Check console for data)");
    // Reset form or redirect
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-6 relative overflow-hidden">
      {/* Background radial gradients for subtle color and depth */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(circle at 10% 10%, rgba(0,191,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 90% 20%, rgba(138,43,226,0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 90%, rgba(255,105,180,0.1) 0%, transparent 50%)
        `
      }}></div>

      {/* Main Content Area: Sidebar + Form */}
      <div className="relative z-10 flex mt-8">
        {/* Left Sidebar (Icon based) */}
        <aside className="w-16 flex flex-col items-center py-8 space-y-8 bg-zinc-900 rounded-xl shadow-lg shadow-black/30 mr-8 border border-gray-800">
          <Button variant="ghost" className="text-blue-400 hover:text-white p-3 rounded-md transition-all duration-300 bg-blue-800/20">
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
        <Card className="flex-1 bg-zinc-900 border border-gray-800 rounded-xl p-10 shadow-2xl shadow-purple-900/40 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-8 ">Create NFT</h1>

          <form onSubmit={handleSubmit} id="nft-form" className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Left Form Section */}
            <div className="space-y-8">
              <div>
                <Label htmlFor="title" className="text-gray-300 mb-2 block">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Certified Blockchain Developer"
                  className="bg-zinc-800 border-gray-700 text-white focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 shadow-md shadow-black/20"
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
                  className="bg-zinc-800 border-gray-700 text-white focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 shadow-md shadow-black/20"
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
                  className="bg-zinc-800 border-gray-700 text-white focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 shadow-md shadow-black/20"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-300 mb-2 block">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-zinc-800 border-gray-700 text-white focus-visible:ring-blue-500 focus-visible:ring-offset-0 shadow-md shadow-black/20">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-gray-700 text-white">
                    {categoriesOptions.map((cat) => (
                      <SelectItem key={cat} value={cat} className="hover:bg-zinc-700 focus:bg-blue-600 focus:text-white data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
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
                    className="flex-grow bg-zinc-800 border-gray-700 text-white focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 shadow-md shadow-black/20"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    required
                  />
                  <Button type="button" className="shrink-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-2 rounded-md shadow-lg shadow-blue-500/30">
                    <FileUp className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="metadataUrl" className="text-gray-300 mb-2 block">Metadata URL (Optional)</Label>
                <Input
                  id="metadataUrl"
                  placeholder="IPFS URL of metadata JSON (if external)"
                  className="bg-zinc-800 border-gray-700 text-white focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 shadow-md shadow-black/20"
                  value={metadataUrl}
                  onChange={(e) => setMetadataUrl(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">Verified By</Label>
                <RadioGroup value={verifiedBy} onValueChange={setVerifiedBy} className="flex flex-wrap gap-4">
                  {verifiedByOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`verified-by-${option}`} className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white data-[state=checked]:border-blue-500" />
                      <Label htmlFor={`verified-by-${option}`} className="text-gray-400 hover:text-white cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="organization" className="text-gray-300 mb-2 block">Organization/Issuer ID (Optional)</Label>
                <Input
                  id="organization"
                  placeholder="e.g., University ID, Company Wallet Address"
                  className="bg-zinc-800 border-gray-700 text-white focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 shadow-md shadow-black/20"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </div>
            </div>

            {/* Right Form Section */}
            <div className="space-y-8">
              <div>
                <Label className="text-gray-300 mb-2 block">Pre-Defined NFT Avatars</Label>
                <div className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-zinc-800 border border-gray-700 shadow-inner shadow-black/30">
                  {preDefinedAvatars.map((avatar) => (
                    <div
                      key={avatar.id}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-200
                        ${selectedAvatar === avatar.id ? 'ring-2 ring-offset-2 ring-offset-zinc-800 ring-blue-500 shadow-lg shadow-blue-500/40 animate-pulse-border' : 'hover:ring-1 hover:ring-gray-600'}
                      `}
                      onClick={() => setSelectedAvatar(avatar.id)}
                    >
                      <img src={avatar.src} alt={avatar.alt} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-md bg-zinc-800 border border-gray-700 shadow-md shadow-black/20">
                <Label htmlFor="isSoulBound" className="text-gray-300 text-base font-medium">Is Soulbound (Non-transferable)</Label>
                <Switch
                  id="isSoulBound"
                  checked={isSoulBound}
                  onCheckedChange={setIsSoulBound}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-600 data-[state=unchecked]:bg-gray-700"
                />
              </div>

              <div>
                <Label htmlFor="tokenId" className="text-gray-300 mb-2 block">Token ID</Label>
                <Input id="tokenId" value={tokenId} disabled className="bg-zinc-800 border-gray-700 text-gray-500 cursor-not-allowed shadow-md shadow-black/20" />
                <p className="text-xs text-gray-500 mt-1">This ID will be generated upon successful minting on the blockchain.</p>
              </div>

              <div>
                <Label htmlFor="mintedAt" className="text-gray-300 mb-2 block">Minting Date & Time</Label>
                <Input
                  id="mintedAt"
                  type="datetime-local"
                  className="bg-zinc-800 border-gray-700 text-white focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 shadow-md shadow-black/20"
                  value={mintedAt}
                  onChange={(e) => setMintedAt(e.target.value)}
                />
              </div>

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
                      className="flex-grow bg-zinc-800 border-gray-700 text-white shadow-md shadow-black/20"
                    />
                    <Input
                      placeholder="Role (e.g., Developer, Designer)"
                      value={contributor.role}
                      onChange={(e) => {
                        const newCont = [...contributors];
                        newCont[index].role = e.target.value;
                        setContributors(newCont);
                      }}
                      className="flex-grow bg-zinc-800 border-gray-700 text-white shadow-md shadow-black/20"
                    />
                    {contributors.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeContributor(index)} className="text-red-500 hover:text-red-400">
                        <FileUp className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={addContributor} className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md px-4 py-2 shadow-lg shadow-purple-500/30">
                  <IoAddCircleOutline className="mr-2 h-5 w-5" /> Add Contributor
                </Button>
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">Visibility Settings</Label>
                <RadioGroup value={visibility} onValueChange={setVisibility} className="flex flex-wrap gap-4 p-2 rounded-md bg-zinc-800 border border-gray-700 shadow-md shadow-black/20">
                  {visibilityOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`visibility-${option}`} className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white data-[state=checked]:border-blue-500" />
                      <Label htmlFor={`visibility-${option}`} className="text-gray-400 hover:text-white cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between p-2 rounded-md bg-zinc-800 border border-gray-700 shadow-md shadow-black/20">
                <Label htmlFor="forSale" className="text-gray-300 text-base font-medium">List for Sale</Label>
                <Switch
                  id="forSale"
                  checked={forSale}
                  onCheckedChange={setForSale}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-600 data-[state=checked]:to-teal-600 data-[state=unchecked]:bg-gray-700"
                />
              </div>

              {forSale && ( // Only show price and currency if forSale is true
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="price" className="text-gray-300 mb-2 block">Sale Price</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g., 1500"
                      className="bg-zinc-800 border-gray-700 text-white focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 shadow-md shadow-black/20"
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
                      <SelectTrigger id="currency" className="bg-zinc-800 border-gray-700 text-white focus-visible:ring-blue-500 focus-visible:ring-offset-0 shadow-md shadow-black/20">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-gray-700 text-white">
                        {currenciesOptions.map((curr) => (
                          <SelectItem key={curr} value={curr} className="hover:bg-zinc-700 focus:bg-blue-600 focus:text-white data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
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
          <div className="flex justify-end space-x-4 mt-12 pt-8 border-t border-gray-800">
            <Button type="submit" form="nft-form" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-md px-8 py-3 text-lg shadow-xl shadow-blue-800/40 transition-all duration-300 transform hover:scale-105">
              Create NFT
            </Button>
            <Button type="button" variant="outline" className="text-gray-200 border-gray-600 hover:border-white hover:text-white font-bold rounded-md px-8 py-3 text-lg shadow-xl shadow-white/10 transition-all duration-300 transform hover:scale-105">
              Preview
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateNfts;