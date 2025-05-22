import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { useFormStore } from "../store/useForm.store.js";
import { addDays, format } from "date-fns";

const Status = ["paid", "pending"];
const InvoiceForm = () => {
  const {
    toggleForm,
    addInvoice,
    invoices,
    editData,
    formState,
    settingUpdatedInvoice,
  } = useFormStore();
  const formHeading = formState === "edit" ? "EDIT" : "CREATE";

  const [formData, setFormData] = useState(() => {
    return {
      id: `INV${Math.floor(Math.random() * 1000)}`,
      billform: {
        street: "",
        city: "",
        postCode: "",
        country: "",
      },
      billTo: {
        clientEmail: "",
        street: "",
        city: "",
        postCode: "",
        country: "",
      },
      paymentStatus: "",
      clientName: "",
      items: [],
      paymentTerms: "Next 30 days",
      projectDescription: "",
      invoiceDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(addDays(new Date(), 30), "yyyy-MM-dd"),
    };
  });
  useEffect(() => {
    if (editData && editData.invoice !== "") {
      setFormData(...editData);
    }
  }, [editData]);

  console.log(editData);

  const addFormItems = () => {
    setFormData({
      ...formData,
      items: [
        ...formData?.items,
        {
          id: `item-${Date.now()}`,
          name: "",
          quantity: "",
          price: "",
          total: 0,
        },
      ],
    });
  };

  //

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === "quantity" || field === "price") {
      const quantity =
        field === "quantity"
          ? value === undefined
            ? 0
            : parseInt(value) || 0
          : newItems[index].quantity;
      const price =
        field === "price" ? parseFloat(value) || 0 : newItems[index].price;
      newItems[index].total = quantity * price;
    }

    setFormData({
      ...formData,
      items: newItems,
    });
  };
  const removeItem = (id) => {
    setFormData({
      ...formData,
      items: formData.items.filter((i) => i.id !== id),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.paymentStatus || formData.paymentStatus === "") {
      alert("Please select a valid payment status."); // Show error message
      return;
    }
    formState === "edit"
      ? settingUpdatedInvoice(formData.id, formData)
      : addInvoice(formData);
  };
  console.log(invoices);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay with click-to-close */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={toggleForm}
      ></div>

      {/* Dialog container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Actual dialog */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{formHeading} Invoice</h2>
              <button
                type="button"
                onClick={toggleForm}
                className="text-gray-400 hover:text-gray-500"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <h3 className="text-violet-500 font-bold">Bill Form</h3>
                <input
                  type="text"
                  placeholder="Street address"
                  value={formData.billform?.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billform: {
                        ...formData.billform,
                        street: e.target.value,
                      },
                    })
                  }
                  required
                  className="w-full rounded-lg bg-slate-100 p-3"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="city"
                  value={formData.billform.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billform: {
                        ...formData.billform,
                        city: e.target.value,
                      },
                    })
                  }
                  required
                  className="w-full rounded-lg bg-slate-100 p-3"
                />
                <input
                  type="text"
                  placeholder="Pin code"
                  value={formData.billform.postCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billform: {
                        ...formData.billform,
                        postCode: e.target.value,
                      },
                    })
                  }
                  required
                  className="w-full rounded-lg bg-slate-100 p-3"
                />
                <input
                  type="text"
                  placeholder="country"
                  value={formData.billform.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billform: {
                        ...formData.billform,
                        country: e.target.value,
                      },
                    })
                  }
                  required
                  className="w-full rounded-lg bg-slate-100 p-3"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-violet-500 font-bold">Bill To</h3>
                <input
                  type="text"
                  placeholder="Client's Name"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clientName: e.target.value,
                    })
                  }
                  required
                  className="w-full bg-slate-100 rounded-lg p-3"
                />
                <input
                  type="email"
                  placeholder="Client's email"
                  value={formData.billTo.clientEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billTo: {
                        ...formData.billTo,
                        clientEmail: e.target.value,
                      },
                    })
                  }
                  required
                  className="w-full bg-slate-100 rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="Street"
                  value={formData.billTo.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billTo: {
                        ...formData.billTo,
                        street: e.target.value,
                      },
                    })
                  }
                  required
                  className="w-full bg-slate-100 rounded-lg p-3"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="city"
                  value={formData.billTo.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billTo: {
                        ...formData.billTo,
                        city: e.target.value,
                      },
                    })
                  }
                  required
                  className="w-full rounded-lg bg-slate-100 p-3"
                />
                <input
                  type="text"
                  placeholder="Pin code"
                  value={formData.billTo.postCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billTo: {
                        ...formData.billTo,
                        postCode: e.target.value,
                      },
                    })
                  }
                  required
                  className="w-full rounded-lg bg-slate-100 p-3"
                />
                <input
                  type="text"
                  placeholder="country"
                  value={formData.billTo.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billTo: {
                        ...formData.billTo,
                        country: e.target.value,
                      },
                    })
                  }
                  required
                  className="w-full rounded-lg bg-slate-100 p-3"
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 ">
                  <input
                    type="date"
                    className="bg-slate-100 rounded-lg p-3"
                    value={formData.invoiceDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setFormData({
                        ...formData,
                        invoiceDate: newDate,
                        dueDate: format(addDays(new Date(), 30), "yyyy-MM-dd"),
                      });
                    }}
                  />
                  <select
                    className="bg-slate-100 rounded-lg p-3"
                    required
                    value={formData.paymentTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentTerms: e.target.value })
                    }
                  >
                    <option>Payment Terms</option>
                    <option>Net 30 days</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Project Description"
                  value={formData.projectDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      projectDescription: e.target.value,
                    })
                  }
                  required
                  className="w-full bg-slate-100 rounded-lg p-3"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-violet-500 font-bold">Item List</h3>
                {formData.items.map((item, index) => (
                  <div
                    className="grid grid-cols-12 gap-4 items-center "
                    key={index}
                  >
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={item.name}
                      className="w-full bg-slate-100 rounded-lg p-3 col-span-5"
                      onChange={(e) =>
                        updateItem(index, "name", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      className="w-full bg-slate-100 rounded-lg p-3 col-span-2"
                      min="1"
                      onChange={(e) =>
                        updateItem(index, "quantity", parseInt(e.target.value))
                      }
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      className="w-full bg-slate-100 rounded-lg p-3 col-span-2"
                      value={item.price}
                      min="0"
                      step="0.01"
                      required
                      onChange={(e) =>
                        updateItem(index, "price", parseFloat(e.target.value))
                      }
                    />
                    <div className="col-span-2 text-right">
                      ${item.total.toFixed(2)}
                    </div>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-red-400"
                      onClick={() => removeItem(item.id)}
                    >
                      <FaRegTrashAlt size={20} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="w-full bg-slate-700 hover:bg-slate-600 rounded-lg p-3 flex items-center justify-center space-x-2"
                  onClick={addFormItems}
                >
                  <CiSquarePlus size={24} />
                  <span>Add Items</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 ">
                <select
                  className="bg-slate-100 rounded-lg p-3"
                  required
                  value={formData.paymentStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentStatus: e.target.value })
                  }
                >
                  <option>Payment Status</option>
                  {Status.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="w-full bg-violet-500 hover:bg-violet-600 rounded-lg text-white px-6 py-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-violet-500 hover:bg-violet-600 rounded-lg text-white px-6 py-3"
                >
                  {formHeading} Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
