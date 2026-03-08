"use client";

import { SongPickerDialog } from "@/components/schedule/song-picker-dialog";
import { PlanItemEditDialog } from "@/components/schedule/plan-item-edit-dialog";
import { PlanItemList } from "@/components/schedule/plan-item-list";
import { PlanTabToolbar } from "@/components/schedule/plan-tab-toolbar";
import { usePlanTabController } from "@/hooks/use-plan-tab-controller";

interface PlanTabProps {
  serviceTypeId: string | null;
  planId: string | null;
}

export function PlanTab({ serviceTypeId, planId }: PlanTabProps) {
  const {
    items,
    isLoading,
    editingItemId,
    editingItem,
    songPickerOpen,
    pendingItemId,
    pendingSongId,
    setEditingItemId,
    setSongPickerOpen,
    createBasicItem,
    addSongToPlan,
    deleteItem,
    reorderItems,
    saveItem,
  } = usePlanTabController({
    serviceTypeId,
    planId,
  });

  return (
    <>
      <SongPickerDialog
        open={songPickerOpen}
        onOpenChange={setSongPickerOpen}
        serviceTypeId={serviceTypeId}
        onSelectSong={async (song) => {
          await addSongToPlan(song);
        }}
        pendingSongId={pendingSongId}
      />

      <PlanItemEditDialog
        item={editingItem}
        open={Boolean(editingItemId)}
        serviceTypeId={serviceTypeId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingItemId(null);
          }
        }}
        onSave={async (input) => {
          await saveItem(input);
        }}
      />

      <div className="flex h-full min-h-0 flex-col gap-4 pb-28 sm:pb-0">
        <PlanTabToolbar
          pendingItemId={pendingItemId}
          onAddSong={() => setSongPickerOpen(true)}
          onAddHeader={() => void createBasicItem("header")}
          onAddItem={() => void createBasicItem("item")}
        />

        <PlanItemList
          items={items}
          isLoading={isLoading}
          pendingItemId={pendingItemId}
          onAddSong={() => setSongPickerOpen(true)}
          onAddHeader={() => void createBasicItem("header")}
          onAddItem={() => void createBasicItem("item")}
          onEditItem={setEditingItemId}
          onDeleteItem={deleteItem}
          onReorderItems={reorderItems}
        />
      </div>
    </>
  );
}
