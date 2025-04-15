import { Xendit } from "xendit-node";

// Initialize Xendit client with secret key from environment variables
const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || "",
});

// Export Xendit API modules
const {
  Invoice,
  PaymentRequest,
  PaymentMethod,
  Balance,
  Transaction,
  Customer,
  Payout,
} = xenditClient;

export {
  Invoice,
  PaymentRequest,
  PaymentMethod,
  Balance,
  Transaction,
  Customer,
  Payout,
};

// Helper function to create a Xendit invoice
export async function createInvoice({
  externalId,
  amount,
  description,
  customer,
  successRedirectUrl,
  failureRedirectUrl,
  items,
}: {
  externalId: string;
  amount: number;
  description: string;
  customer?: {
    email?: string;
    name?: string;
    mobile_number?: string;
  };
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    category?: string;
  }>;
}) {
  try {
    const invoice = await Invoice.createInvoice({
      data: {
        amount,
        externalId,
        description,
        customer,
        successRedirectUrl,
        failureRedirectUrl,
        items,
        currency: "IDR",
      },
    });

    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error creating Xendit invoice:", error);
    return { success: false, error };
  }
}

// Helper function to get invoice status
export async function getInvoiceStatus(invoiceId: string) {
  try {
    const invoice = await Invoice.getInvoiceById({ invoiceId });
    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error getting Xendit invoice:", error);
    return { success: false, error };
  }
}

// Helper function to create a payment request
export async function createPaymentRequest({
  externalId,
  amount,
  description,
}: {
  externalId: string;
  amount: number;
  description: string;
}) {
  try {
    const paymentRequest = await PaymentRequest.createPaymentRequest({
      data: {
        amount,
        currency: "IDR",
        paymentMethodId: "pm-1234",
        description,
        referenceId: externalId,
        metadata: {
          originApp: "kasir-online",
        },
      },
    });

    return { success: true, data: paymentRequest };
  } catch (error) {
    console.error("Error creating Xendit payment request:", error);
    return { success: false, error };
  }
}

// Helper function to create a payment method
export async function createPaymentMethod({
  customerId,
}: {
  customerId?: string;
}) {
  try {
    const paymentMethod = await PaymentMethod.createPaymentMethod({
      data: {
        type: "CARD", // Fixed type as 'CARD' to match PaymentMethodType
        reusability: "ONE_TIME_USE",
        customerId,
        metadata: {
          originApp: "kasir-online",
        },
      },
    });

    return { success: true, data: paymentMethod };
  } catch (error) {
    console.error("Error creating Xendit payment method:", error);
    return { success: false, error };
  }
}

export default xenditClient;
