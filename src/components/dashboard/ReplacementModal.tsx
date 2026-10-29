"use client";

import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SuccessState } from "@/components/ui/SuccessState";
import { useUserData } from "@/lib/useUserData";
import { Truck, CreditCard } from "lucide-react";

interface ReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReplacementModal({ isOpen, onClose }: ReplacementModalProps) {
  const intl = useIntl();
  const { data } = useUserData();
  const [address, setAddress] = useState({
    street: data.street ? `${data.street} ${data.houseNumber}` : "Keizersgracht 421",
    zipcode: data.postalCode || "1016 EK",
    city: data.city || "Amsterdam",
  });
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    if (data.street) {
      setAddress({
        street: `${data.street} ${data.houseNumber}${data.addition ? ` ${data.addition}` : ""}`,
        zipcode: data.postalCode,
        city: data.city,
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrdered(true);
    setTimeout(() => {
      setOrdered(false);
      onClose();
    }, 3500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={intl.formatMessage({ id: "modals.repTitle" })}
      description={intl.formatMessage({ id: "modals.repDesc" })}
      maxWidth="md"
    >
      {ordered ? (
        <SuccessState
          size="sm"
          title={<FormattedMessage id="modals.repSuccessTitle" />}
          description={
            <FormattedMessage
              id="modals.repSuccessDesc"
              values={{ address: `${address.street}, ${address.city}` }}
            />
          }
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-slate-900 dark:text-white">
                <FormattedMessage id="modals.foilTitle" />
              </span>
            </div>
            <span className="font-display font-extrabold text-base text-slate-900 dark:text-white">
              €5,00
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <FormattedMessage id="modals.streetLabel" />
            </label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <FormattedMessage id="modals.zipLabel" />
              </label>
              <input
                type="text"
                value={address.zipcode}
                onChange={(e) => setAddress({ ...address, zipcode: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <FormattedMessage id="modals.cityLabel" />
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-1">
            <FormattedMessage id="modals.postnlNote" />
          </p>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              <FormattedMessage id="common.cancel" />
            </Button>
            <Button type="submit" size="sm" className="shadow-md shadow-emerald-600/20">
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              <FormattedMessage id="modals.payBtn" />
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
