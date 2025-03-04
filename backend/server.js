const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process"); // Execute Python script
const upload = require("./controller/fileUpload");
const mongoose = require("./db"); // ✅ Import Mongoose connection
const ImageProcessing = require("./models/image"); // ✅ Import Model
const User = require("./models/user"); // ✅ Import User model

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Function to Convert Image to Base64
function encodeImage(imagePath) {
    if (!fs.existsSync(imagePath)) return null;
    return fs.readFileSync(imagePath, { encoding: "base64" });
}

// ✅ POST: Upload Image & Process with Python
app.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = path.join(__dirname, "uploads", req.file.filename);
    const fileBase64 = encodeImage(filePath); // Convert uploaded image to Base64
    const pythonScriptPath = path.join(process.cwd(), "ml", "master.py");

    try {
        // ✅ Save Initial Image Data in MongoDB (before processing)
        const newImage = new ImageProcessing({
            imageId: req.file.filename.split(".")[0], // Unique ID from filename
            filePath,
            processed: false,
            processedAt: new Date(),
            resultData: {
                processedImage: `data:image/jpeg;base64,${fileBase64}`, // Default uploaded image
                analysis: {
                    acne: { ResultImage: null, positions: [], confidence: 0, score: 0 },
                    wrinkles: { ResultImage: null, positions: [], confidence: 0, score: 0 },
                    scar: { ResultImage: null, positions: [], confidence: 0, score: 0 },
                    undereye: { ResultImage: null, positions: [], confidence: 0, score: 0 },
                    darkspot: { ResultImage: null, positions: [], confidence: 0, score: 0 },
                    age: "Not Detected",
                    gender: "Not Detected"
                }
            }
        });

        const savedImage = await newImage.save();

        // ✅ Trigger Python Processing
        exec(`python3 ${pythonScriptPath} ${filePath}`, async (error, stdout, stderr) => {
            console.log("🚀 Running Python script...");

            if (error) {
                console.error("❌ Error executing Python script:", error);
                return res.status(500).json({ message: "Error processing image." });
            }

            if (stderr) {
                console.error("🐍 Python stderr:", stderr);
            }

            console.log("📝 Raw Python stdout:", stdout);

            // ✅ Extract JSON from Python Output
            let jsonStart = stdout.indexOf("{");
            let jsonEnd = stdout.lastIndexOf("}");

            if (jsonStart === -1 || jsonEnd === -1) {
                console.error("❌ No valid JSON found in Python response");
                return res.status(500).json({ message: "Invalid response from Python script." });
            }

            let jsonString = stdout.substring(jsonStart, jsonEnd + 1).trim();

            // ✅ Parse JSON Response
            let pythonResponse;
            try {
                pythonResponse = JSON.parse(jsonString);
                console.log("✅ Parsed Python Response:", JSON.stringify(pythonResponse, null, 2));
            } catch (parseError) {
                console.error("❌ Error parsing Python response:", parseError);
                return res.status(500).json({ message: "Invalid JSON format from Python script." });
            }

            // ✅ Update MongoDB with Processed Data
            const updatedImage = await ImageProcessing.findByIdAndUpdate(
                savedImage._id,
                {
                    processed: true,
                    processedAt: new Date(),
                    "resultData.originalFilename": req.file.filename,
                    "resultData.processedImage": pythonResponse.processedImage,
                    "resultData.analysis.acne.ResultImage": pythonResponse.acne?.ResultImage || null,
                    "resultData.analysis.acne.positions": pythonResponse.acne?.positions || [],
                    "resultData.analysis.acne.score": pythonResponse.acne?.score || 0,
                    "resultData.analysis.wrinkles": pythonResponse.wrinkles || { ResultImage: null, positions: [], score: 0 },
                    "resultData.analysis.scar": pythonResponse.scar || { ResultImage: null, positions: [], score: 0 },
                    "resultData.analysis.undereye": pythonResponse.undereye || { ResultImage: null, positions: [], score: 0 },
                    "resultData.analysis.darkspot": pythonResponse.darkspot || { ResultImage: null, positions: [], score: 0 },
                    "resultData.analysis.age": pythonResponse.age || "Not Detected",
                    "resultData.analysis.gender": pythonResponse.gender || "Not Detected"
                },
                { new: true }
            );

            console.log("✅ MongoDB Updated:", updatedImage);

            // ✅ Fetch the Updated Data
            const response = await ImageProcessing.findById(updatedImage._id);

            // ✅ Send Response in the Required Format
            res.json({
                processedImage: response.resultData.processedImage,
                acne: {
                    acneImage: response.resultData.analysis.acne.ResultImage,
                    acnePosition: response.resultData.analysis.acne.positions,
                    acneScore: response.resultData.analysis.acne.score,
                },
                wrinkles: {
                    wrinklesImage: response.resultData.analysis.wrinkles.ResultImage,
                    wrinklesPosition: response.resultData.analysis.wrinkles.positions,
                    wrinklesScore: response.resultData.analysis.wrinkles.score,
                },
                scar: {
                    scarImage: response.resultData.analysis.scar.ResultImage,
                    scarPosition: response.resultData.analysis.scar.positions,
                    scarScore: response.resultData.analysis.scar.score,
                },
                undereye: {
                    undereyeImage: response.resultData.analysis.undereye.ResultImage,
                    undereyePosition: response.resultData.analysis.undereye.positions,
                    undereyeScore: response.resultData.analysis.undereye.score,
                },
                darkspot: {
                    darkspotImage: response.resultData.analysis.darkspot.ResultImage,
                    darkspotPosition: response.resultData.analysis.darkspot.positions,
                    darkspotScore: response.resultData.analysis.darkspot.score,
                },
                age: response.resultData.analysis.age,
                gender: response.resultData.analysis.gender
            });
        });

    } catch (dbError) {
        console.error("❌ Error saving to MongoDB:", dbError);
        res.status(500).json({ message: "Error saving data to database." });
    }
});

// ✅ Start Server Only After MongoDB Connects
mongoose.connection.once("open", () => {
    console.log("🚀 MongoDB Connected. Starting server...");
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});

// ✅ Handle MongoDB Connection Errors
mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit server if database connection fails
});
