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