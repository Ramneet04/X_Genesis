import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { IoAddCircleOutline } from "react-icons/io5";
import { ExternalLink } from "lucide-react";
import { useState, useMemo } from "react";
import UploadPDF from "@/components/ui/UploadPDF";
import { useDispatch, useSelector } from "react-redux";
import { setPlagiarismInfo } from "@/slices/nft";
import { useNavigate } from "react-router-dom";
import { getContractInstance } from "@/utils/getContract";
import toast from "react-hot-toast";
import { useAppSelector } from "@/main";
import { apiConnector } from "@/services/apiConnector";



interface Contributor {
  email: string;
  role: string;
}



const CreateNfts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useAppSelector((state) => state.user);
  const { address, chainId } = useAppSelector((state) => state.wallet);
  const plagiarismInfo = useSelector((state: any) => state.nft.plagiarismInfo);


  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState("Project");
  const [verifiedBy, setVerifiedBy] = useState("Self");
  const [organization, setOrganization] = useState("");
  const [selectedOrgFromList, setSelectedOrgFromList] = useState("");
  const [contributors, setContributors] = useState<Contributor[]>([{ email: "", role: "" }]);

  const [documentUrl, setDocumentUrl] = useState("");
  const [externalFileLink, setExternalFileLink] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [avatarFilterCategory, setAvatarFilterCategory] = useState("All");


  const categoriesOptions = [
    "Project", "Internship", "Certificate", "Hackathon",
    "ResearchPaper", "OpenSource", "Resume", "Skill",
  ];

  const predefinedOrganizations = [
    { id: "org_innovatech_uni",        name: "InnovateTech University" },
    { id: "org_global_blockchain",     name: "Global Blockchain Institute" },
    { id: "org_quantum_solutions",     name: "Quantum Solutions Corp." },
    { id: "org_open_source_collective",name: "Open Source Collective" },
  ];

  const preDefinedAvatars = [
    { id: 1,  src: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1762283041/Gemini_Generated_Image_qppojyqppojyqppo_xayvvg.png", alt: "Project Avatar 1",       category: "Project" },
    { id: 2,  src: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750961882/Gemini_Generated_Image_o62qn1o62qn1o62q_a8w9uy.png", alt: "Internship Avatar 1",     category: "Internship" },
    { id: 3,  src: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750954071/Gemini_Generated_Image_8z1gon8z1gon8z1g_t7icqt.png", alt: "Certificate Avatar 1",    category: "Certificate" },
    { id: 4,  src: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750954071/Gemini_Generated_Image_8z1gon8z1gon8z1g_t7icqt.png", alt: "Hackathon Avatar 1",      category: "Hackathon" },
    { id: 5,  src: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750961601/Gemini_Generated_Image_pkc1fgpkc1fgpkc1_f5nzyo.png", alt: "Research Paper Avatar 1", category: "ResearchPaper" },
    { id: 6,  src: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750954071/Gemini_Generated_Image_8z1gon8z1gon8z1g_t7icqt.png", alt: "Open Source Avatar 1",    category: "OpenSource" },
    { id: 7,  src: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750961548/Gemini_Generated_Image_fn17w6fn17w6fn17_zwg84r.png", alt: "Resume Avatar 1",         category: "Resume" },
    { id: 8,  src: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1762185179/Gemini_Generated_Image_4zag6s4zag6s4zag_h581wv.png", alt: "Skill Avatar 1",          category: "Skill" },
    { id: 9,  src: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1762282981/Gemini_Generated_Image_eb0lwieb0lwieb0l_m1xxyn.png", alt: "Project Avatar 2",        category: "Project" },
    { id: 10, src: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750961248/Gemini_Generated_Image_6ztzvv6ztzvv6ztz_cvxbfu.png", alt: "Internship Avatar 2",     category: "Internship" },
    { id: 11, src: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750961230/Gemini_Generated_Image_4qrb3q4qrb3q4qrb_oav7kw.png", alt: "Skill Avatar 2",          category: "Skill" },
  ];

  useMemo(() => {
    if (selectedAvatar === null && preDefinedAvatars.length > 0) {
      setSelectedAvatar(preDefinedAvatars[0].id);
    }
  }, []);

  const filteredAvatars = useMemo(() => {
    if (avatarFilterCategory === "All") return preDefinedAvatars;
    return preDefinedAvatars.filter((a) => a.category === avatarFilterCategory);
  }, [avatarFilterCategory]);

  const actualOrganizationValue = useMemo(() => {
    if (verifiedBy === "Organization/Institution") {
      return selectedOrgFromList || organization;
    }
    return "";
  }, [verifiedBy, selectedOrgFromList, organization]);

  const resolvedDocumentUrl = documentUrl || externalFileLink || "";

  const addContributor = () =>
    setContributors([...contributors, { email: "", role: "" }]);
  const removeContributor = (index: number) =>
    setContributors(contributors.filter((_, i) => i !== index));
  const updateContributor = (index: number, field: keyof Contributor, value: string) => {
    const updated = [...contributors];
    updated[index][field] = value;
    setContributors(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !chainId) {
      toast.error("Please connect your wallet first.");
      return;
    }

    const selectedAvatarSrc = preDefinedAvatars.find((a) => a.id === selectedAvatar)?.src;
    if (!selectedAvatarSrc) {
      toast.error("Please select an avatar.");
      return;
    }

    if (plagiarismInfo?.isPlagiarised) {
      toast.error("Your document was flagged for plagiarism. Please upload an original document.");
      return;
    }

    const toastId = toast.loading("⏳ Minting your NFT… Please confirm in MetaMask");

    try {
      const blob = await (await fetch(selectedAvatarSrc)).blob();
      const imgForm = new FormData();
      imgForm.append("file", blob, "avatar.png");

      const imgUploadRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          pinata_api_key:        import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_API_SECRET,
        },
        body: imgForm,
      });
      if (!imgUploadRes.ok) throw new Error("Failed to upload avatar to IPFS.");
      const { IpfsHash: imageHash } = await imgUploadRes.json();
      const imageIpfs    = `ipfs://${imageHash}`;
      const imageGateway = `https://gateway.pinata.cloud/ipfs/${imageHash}`;

      const metadata = {
        name: title,
        description,
        image: imageIpfs,
        tags: tags.length > 0 ? tags : [],
        // Store the actual document URL in the IPFS metadata too
        document: resolvedDocumentUrl,
        attributes: [
          { trait_type: "Category",    value: category },
          { trait_type: "Verified By", value: verifiedBy },
          ...(actualOrganizationValue
            ? [{ trait_type: "Organization", value: actualOrganizationValue }]
            : []),
          ...contributors
            .filter((c) => c.email)
            .map((c) => ({
              trait_type: `Contributor (${c.role || "Contributor"})`,
              value: c.email,
            })),
        ],
      };

      const metaUploadRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });
      if (!metaUploadRes.ok) throw new Error("Failed to upload metadata to IPFS.");
      const { IpfsHash: metaHash } = await metaUploadRes.json();
      const metaIpfsUrl   = `ipfs://${metaHash}`;
      const metaGatewayUrl = `https://gateway.pinata.cloud/ipfs/${metaHash}`;

      // 3. Mint on-chain
      const contractInstance = await getContractInstance();
      let receipt: any;
      try {
        const tx = await contractInstance.safeMint(metaIpfsUrl);
        receipt = await tx.wait();
        if (!receipt?.hash) throw new Error("Transaction receipt missing.");
        toast.dismiss(toastId);
        toast.success(`Minted! Tx: ${receipt.hash.slice(0, 10)}…`);
      } catch (mintErr: any) {
        toast.dismiss(toastId);
        toast.error(`Minting failed: ${mintErr.message}`);
        return;
      }

      // 4. Parse tokenId from Transfer event
      const transferEvent = receipt.logs
        .map((log: any) => {
          try { return contractInstance.interface.parseLog(log); } catch { return null; }
        })
        .find((parsed: any) => parsed?.name === "Transfer");
      const tokenId = transferEvent?.args?.tokenId?.toString();

      // 5. Persist to backend DB
      const saveToast = toast.loading("⏳ Saving NFT to database…");
      try {
        await apiConnector(
          "POST",
          `${import.meta.env.VITE_API_BASE_URL}/nft/create`,
          {
            title,
            description,
            tags,
            category,
            fileUrl:         imageGateway,   // avatar thumbnail
            documentUrl:     resolvedDocumentUrl, // the actual credential document
            metadataUrl:     metaGatewayUrl,
            verifiedBy,
            organization:    actualOrganizationValue || null,
            contributors,
            walletAddress:   address,
            tokenId,
            transactionHash: receipt.hash,
            chainId,
          },
          { Authorization: `Bearer ${token}` }
        );
        toast.dismiss(saveToast);
        toast.success("NFT created successfully!");
        navigate("/dashboard");
      } catch (saveErr) {
        toast.dismiss(saveToast);
        console.error("DB save error:", saveErr);
        toast.error("NFT minted on-chain but failed to save to database.");
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      console.error("NFT creation error:", error);
      toast.error(error.message ?? "An unexpected error occurred.");
    }
  };

  // ── styles ───────────────────────────────────────────────────────────────────
  const inputStyles =
    "bg-slate-950/90 border border-gray-700 text-white rounded-2xl shadow-md shadow-black/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:border-cyan-400 focus-visible:ring-offset-0 placeholder:text-gray-500";
  const cardStyles =
    "bg-slate-900/80 border border-gray-700 rounded-2xl shadow-xl shadow-black/30 backdrop-blur-md";
  const selectStyles =
    "bg-slate-950/90 border border-gray-700 text-white rounded-2xl shadow-md shadow-black/30 focus:ring-2 focus:ring-cyan-400";
  const buttonPrimary =
    "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/30 rounded-xl transition-all duration-200";
  const buttonOutline =
    "border border-gray-700 bg-slate-900 hover:bg-slate-800 text-gray-200 rounded-xl";

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Create NFT
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Mint your credential on-chain as a verifiable NFT
          </p>
        </div>

        <form onSubmit={handleSubmit} id="nft-form">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── LEFT ─────────────────────────────────────────────────────── */}
            <div className="space-y-6">

              {/* Document Upload */}
              <Card className={`p-6 ${cardStyles}`}>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Document
                </p>

                {/* Pass `category` so the backend uses the right threshold */}
                <UploadPDF
                  category={category}
                  onUpload={(url, plagiarism) => {
                    setDocumentUrl(url);
                    dispatch(setPlagiarismInfo(plagiarism));
                  }}
                />

                {/* Plagiarism result banner */}
                {plagiarismInfo && (
                  <div
                    className={`mt-4 p-4 rounded-xl border text-sm ${
                      plagiarismInfo.isPlagiarised
                        ? "bg-red-500/10 border-red-500/30 text-red-300"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    }`}
                  >
                    <div className="font-semibold mb-1">
                      {plagiarismInfo.isPlagiarised
                        ? "⚠ Plagiarism detected — minting blocked"
                        : "✓ Plagiarism check passed"}
                    </div>
                    <div className="text-xs opacity-80">
                      Similarity score: {((plagiarismInfo.plagiarismScore ?? 0) * 100).toFixed(2)}%
                    </div>
                  </div>
                )}

                {/* Uploaded document preview link */}
                {documentUrl && (
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View uploaded document
                  </a>
                )}

                {/* External link fallback */}
                <div className="mt-5">
                  <Label className="text-sm text-gray-300 mb-2 block">
                    Or paste a document link
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://ipfs.io/ipfs/… or Google Drive link"
                    value={externalFileLink}
                    onChange={(e) => setExternalFileLink(e.target.value)}
                    className={inputStyles}
                    disabled={!!documentUrl} // disable if PDF already uploaded
                  />
                  {documentUrl && (
                    <p className="text-xs text-gray-500 mt-1">
                      External link disabled — PDF already uploaded above.
                    </p>
                  )}
                </div>
              </Card>

              {/* Details */}
              <Card className={`p-6 ${cardStyles}`}>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Details
                </p>
                <div className="space-y-5">

                  {/* Title */}
                  <div>
                    <Label className="text-sm text-gray-300 mb-2 block">Title</Label>
                    <Input
                      placeholder="e.g. Certified Blockchain Developer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className={inputStyles}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label className="text-sm text-gray-300 mb-2 block">Description</Label>
                    <Textarea
                      placeholder="A brief description of your credential"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className={`${inputStyles} resize-none`}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <Label className="text-sm text-gray-300 mb-2 block">Tags</Label>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => setTags(tags.filter((_, i) => i !== index))}
                              className="opacity-70 hover:opacity-100 leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <Input
                      placeholder="Type a tag and press Enter or comma"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                          e.preventDefault();
                          if (!tags.includes(tagInput.trim())) {
                            setTags([...tags, tagInput.trim()]);
                          }
                          setTagInput("");
                        } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
                          setTags(tags.slice(0, -1));
                        }
                      }}
                      className={inputStyles}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label className="text-sm text-gray-300 mb-2 block">Category</Label>
                    <Select
                      value={category}
                      onValueChange={(val) => {
                        setCategory(val);
                        // Reset plagiarism info when category changes (threshold changes)
                        dispatch(setPlagiarismInfo(null));
                        setDocumentUrl("");
                      }}
                    >
                      <SelectTrigger className={selectStyles}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border border-gray-700 text-white rounded-xl">
                        {categoriesOptions.map((cat) => (
                          <SelectItem
                            key={cat}
                            value={cat}
                            className="focus:bg-cyan-500 focus:text-white"
                          >
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Changing category resets the uploaded document (different plagiarism threshold applies).
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* ── RIGHT ────────────────────────────────────────────────────── */}
            <div className="space-y-6">

              {/* Avatar */}
              <Card className={`p-6 ${cardStyles}`}>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                  NFT Avatar
                </p>
                <Select value={avatarFilterCategory} onValueChange={setAvatarFilterCategory}>
                  <SelectTrigger className={`${selectStyles} mb-4`}>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border border-gray-700 text-white rounded-xl">
                    <SelectItem value="All">All categories</SelectItem>
                    {categoriesOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1">
                  {filteredAvatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 ${
                        selectedAvatar === avatar.id
                          ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 shadow-lg shadow-cyan-500/30"
                          : "hover:ring-1 hover:ring-gray-500"
                      }`}
                    >
                      <img src={avatar.src} alt={avatar.alt} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </Card>

              {/* Verification */}
              <Card className={`p-6 ${cardStyles}`}>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Verification
                </p>
                <div className="space-y-5">

                  <div>
                    <Label className="text-sm text-gray-300 mb-3 block">Verified by</Label>
                    <RadioGroup value={verifiedBy} onValueChange={setVerifiedBy} className="flex gap-5">
                      {["Self", "Organization/Institution"].map((option) => (
                        <div key={option} className="flex items-center gap-2">
                          <RadioGroupItem value={option} id={`vb-${option}`} />
                          <Label htmlFor={`vb-${option}`} className="text-sm text-white cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {verifiedBy === "Organization/Institution" && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-300 mb-2 block">Select organization</Label>
                        <Select value={selectedOrgFromList} onValueChange={setSelectedOrgFromList}>
                          <SelectTrigger className={selectStyles}>
                            <SelectValue placeholder="Choose organization" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border border-gray-700 text-white rounded-xl">
                            {predefinedOrganizations.map((org) => (
                              <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-300 mb-2 block">
                          Or enter organization name
                        </Label>
                        <Input
                          placeholder="Organization name or wallet"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          required={!selectedOrgFromList}
                          className={inputStyles}
                        />
                      </div>
                    </div>
                  )}

                  {/* Contributors */}
                  <div className="border-t border-gray-700 pt-5">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                      Contributors
                    </p>
                    <div className="space-y-3">
                      {contributors.map((contributor, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder="User ID / Wallet"
                            value={contributor.email}
                            onChange={(e) => updateContributor(index, "email", e.target.value)}
                            className={inputStyles}
                          />
                          <Input
                            placeholder="Role"
                            value={contributor.role}
                            onChange={(e) => updateContributor(index, "role", e.target.value)}
                            className={inputStyles}
                          />
                          {contributors.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeContributor(index)}
                              className="text-red-400 hover:text-red-300 shrink-0"
                            >
                              <IoAddCircleOutline className="h-5 w-5 rotate-45" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addContributor}
                      className={`mt-4 ${buttonOutline}`}
                    >
                      <IoAddCircleOutline className="mr-2 h-4 w-4" />
                      Add contributor
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className={`px-6 ${buttonOutline}`}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="nft-form"
              disabled={plagiarismInfo?.isPlagiarised}
              className={`px-6 ${buttonPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {verifiedBy === "Self" ? "Create NFT" : "Submit for approval"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNfts;