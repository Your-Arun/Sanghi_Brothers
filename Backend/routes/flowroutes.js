const exrress = require("express");
const FlowRouter = exrress.Router();

const InOutFlow = require("../models/inFlowOutFlow");

FlowRouter.post("/monthlyflow", async (req, res) => {
  try {
    const monthlyFlow = new InOutFlow(req.body); // Use the model to create a new instance
    await monthlyFlow.save(); // Save the instance to the database
    res.status(200).json({ message: "Data saved successfully" }); // Use res.status() for setting the status code
  } catch (error) {
    console.error(error); // Use console.error for logging errors
    res.status(500).json({ message: "Error saving data" }); // Send a proper error response
  }
});
FlowRouter.get("/monthlyflow", async (req, res) => {
  try {
    const flowwrepsort = await InOutFlow.find();
    res.status(200).send(flowwrepsort);
  } catch (error) {
    res.status(500).send(error);
  }
});

FlowRouter.get("/monthlyflow/:id", async (req, res) => {
  try {
    const flowwrepsort = await InOutFlow.findById(req.params.id);
    res.status(200).send(flowwrepsort);
  } catch (error) {
    res.status(500).send(error);
  }
});

FlowRouter.get("/monthlyflow/:id", async (req, res) => {
  try {
    const flowPosition = await InOutFlow.findById(req.params.id);
    if (!flowPosition)
      return res.status(404).json({ message: "Fund position not found" });
    res.json(flowPosition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

FlowRouter.put("/monthlyflow/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body; // This should match the structure of your report

  try {
    // Assuming you are using a database like MongoDB
    const result = await InOutFlow.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!result) {
      return res.status(404).send("Report not found");
    }
    res.send(result);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).send("Error updating report");
  }
});

FlowRouter.patch("/monthlyflow/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body; // This should match the structure of your report

  try {
    // Assuming you are using a database like MongoDB
    const result = await InOutFlow.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!result) {
      return res.status(404).send("Report not found");
    }
    res.send(result);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).send("Error updating report");
  }
});

// Delete a report by ID
FlowRouter.delete("/monthlyflow/:id", async (req, res) => {
  try {
    const report = await InOutFlow.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).send();
    }
    res.status(200).send(report);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = FlowRouter;
