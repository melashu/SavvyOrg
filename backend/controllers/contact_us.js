// controllers/contactController.js
const nodemailer = require("nodemailer"); // Import nodemailer module
const Contact = require("../models/contact_us");

let messages = []; // Store all chat messages
let clients = []; // Store all connected SSE clients

// Handle SSE connection for real-time updates
const streamMessages = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
    res.end();
  });
};

clients.forEach((client) =>
  client.write(`data: ${JSON.stringify(newMessage)}\n\n`)
);

const contactUs = {
  // Function to send forget password email
  sendMessage: async (req, res) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "yilkalderseh@gmail.com",
        pass: "yhwa isun lhfc akpe",
      },
    });

    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    try {
      // Save the message in the database
      const contactMessage = new Contact({ name, email, message });
      await contactMessage.save();

      // Prepare the new message object to send to connected clients
      const newMessage = { name, email, message };
      messages.push(newMessage); // Add the message to the list
      // Send the new message to all connected clients via SSE
      clients.forEach((client) =>
        client.write(`data: ${JSON.stringify(newMessage)}\n\n`)
      );
      // Send success response to the sender
      res
        .status(201)
        .json({ message: "Your message has been sent successfully!" });
    } catch (error) {
      console.error("Error saving contact message:", error);
      res
        .status(500)
        .json({ error: "Failed to send message. Please try again later." });
    }

    const mailOptions = {
      from: "yilkalderseh@gmail.com",
      to: "yilkalderseh@gmail.com",
      subject: "Savvy Bridge:",
      text: `Message From: ${name}
             Message from Savvy Bridge: ${message}`,
    };

    const mailOption2 = {
      from: "yilkalderseh@gmail.com",
      to: `${email}`,
      subject: "Savvy Bridge:",
      text: `You Sent: ${message} this message SAVVY BRIDGE`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending a message:", error);
        res.status(500).json({ message: "Failed to send a message" });
      } else {
        res.status(200).json({ message: message });
      }
    });

    transporter.sendMail(mailOption2, (error, info) => {
      if (error) {
        console.error("Error sending a message:", error);
        res.status(500).json({ message: "Failed to send a message" });
      } else {
        res.status(200).json({ message: message });
      }
    });
  },
};

// Get all contact messages
const getContactMessages = async (req, res) => {
  try {
    const allMessages = await Contact.find().sort({ createdAt: -1 }); // Fetch messages sorted by the most recent
    res.status(200).json(allMessages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { streamMessages, contactUs, getContactMessages };
