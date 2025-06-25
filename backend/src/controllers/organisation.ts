import { Request, Response } from "express";
import Organization from "../models/organizations";
import OrgUser from "../models/orgUser";


export const createOrganization = async (req:Request, res:Response)=>{
    try {
        const { name, domain, logo, description } = req.body;
        const userId = req.user.id;
        const organization = await Organization.create({ 
            name,
            domain,
            logo,
            description
        });
        await OrgUser.create({
            user: userId,
            organization: organization._id,
            role:"OrgAdmin",
        })
        return res.status(201).json({ 
            message: "Organization created successfully",
            success:true,
            organization
         });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating organization",
            success:false
        })
    }
}

export const getAllOrganizations = async (req:Request, res:Response) => {
  try {
    const orgs = await Organization.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, organizations: orgs });
  } catch (err) {
    console.error("Get All Orgs Error:", err);
    res.status(500).json({ success: false, message: "Failed to get organizations." });
  }
};

export const getOrganizationById = async (req:Request, res:Response) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ success: false, message: "Organization not found." });

    res.status(200).json({ success: true, organization: org });
  } catch (err) {
    console.error("Get Org Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch organization." });
  }
};
export const updateOrganization = async (req:Request, res:Response) => {
  try {
    const updates = req.body;
    const org = await Organization.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!org) return res.status(404).json({ success: false, message: "Organization not found." });

    res.status(200).json({ success: true, organization: org });
  } catch (err) {
    console.error("Update Org Error:", err);
    res.status(500).json({ success: false, message: "Failed to update organization." });
  }
};
