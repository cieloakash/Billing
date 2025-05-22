import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format, addDays } from "date-fns";

export const useFormStore = create(
  persist(
    (set, get) => ({
      invoices: [],
      filter: "all",
      isFormOpen: false,
      selectedInvoice: null,
      active: null,
      editData: "",
      formState: "",

      calcAmount: (items) => {
        if (!items || !Array.isArray(items)) return 0;
        
        return items.reduce((total, item) => {
          const quantity = Number(item.quantity) || 0;
          const price = Number(item.price) || 0;
          return total + (quantity * price);
        }, 0);
      },

      addInvoice: (state) => {
        const amount = get().calcAmount(state.items);
        const dueDate = format(addDays(new Date(), 30), "yyyy-MM-dd");
        set((currState) => ({
          invoices: [...currState.invoices, { ...state, amount, dueDate }],
          formState: "create",
        }));
        get().toggleForm();
      },
      toggleForm: () => {
        set({ isFormOpen: !get().isFormOpen });
      },

      gettingSingleInvoice: (id) => {
        const selectedId = get().invoices.filter(
          (invoice) => invoice.id === id
        );
        const activeprev = get().active;
        set({
          selectedInvoice: selectedId,
          active: activeprev === id ? null : id,
        });
      },

      editInvoice: (updatedInvoice) => {
        set({
          formState: "edit",
          editData: updatedInvoice,
        });
        get().toggleForm();
      },

      settingUpdatedInvoice: (id, newValue) => {
        const restVal = get().invoices.filter((invoice) => invoice.id !== id);
        set({ invoices: [...restVal, newValue] });
        get().toggleForm();
        set({ editData: "" });
      },

      deleteForm: (id) => {
        const filtered = get().invoices.filter((i) => i.id !== id);
        set({ invoices: [...filtered],selectedInvoice:"" });
       
        
      },

      markPaid: (id) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, paymentStatus: "paid" } : invoice
          ),
        }));
        
      },
    }),
    { name: "formValue", getStorage: () => localStorage }
  )
);
