import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useCreateTicket } from "../hooks/useTickets";

export default function TicketForm() {
  const { t } = useTranslation();
  const createTicket = useCreateTicket();

  const ticketSchema = useMemo(
    () =>
      z.object({
        title: z.string().min(3, t("ticketForm.validation.titleMinLength")).max(120),
        description: z.string().max(1000).optional().or(z.literal("")),
        priority: z.enum(["low", "normal", "high"]),
      }),
    [t]
  );

  type TicketFormData = z.infer<typeof ticketSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { title: "", description: "", priority: "normal" },
  });

  const onSubmit = (data: TicketFormData) => {
    createTicket.mutate(
      {
        title: data.title,
        description: data.description || null,
        priority: data.priority,
      },
      { onSuccess: () => reset() }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border rounded-lg p-4 mb-6"
    >
      <h2 className="text-lg font-semibold mb-3">{t("ticketForm.heading")}</h2>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <input
            id="ticket-title"
            {...register("title")}
            placeholder={t("ticketForm.titlePlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>
        <div className="flex-1 min-w-[200px]">
          <input
            id="ticket-description"
            {...register("description")}
            placeholder={t("ticketForm.descriptionPlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            id="ticket-priority"
            {...register("priority")}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">{t("common.priority.low")}</option>
            <option value="normal">{t("common.priority.normal")}</option>
            <option value="high">{t("common.priority.high")}</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={createTicket.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {createTicket.isPending ? t("ticketForm.creating") : t("ticketForm.create")}
        </button>
      </div>
      {createTicket.isError && (
        <p className="text-red-600 text-sm mt-2">{t("ticketForm.error.createFailed")}</p>
      )}
    </form>
  );
}
