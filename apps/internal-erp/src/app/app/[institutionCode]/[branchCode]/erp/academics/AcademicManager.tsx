"use client";

import { useState } from "react";
import { Tabs, Tab, Accordion, AccordionItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Card, CardBody, Chip, useDisclosure } from "@nextui-org/react";
import { Plus, BookOpen, Network, LayoutGrid } from "lucide-react";
import { CheckPermission } from "@/components/CheckPermission";

export function AcademicManager({ institutionCode, branchCode }: { institutionCode: string, branchCode: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKey, setSelectedKey] = useState("courses");

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Academic Curriculum Tree</h2>
          <p className="text-muted-foreground text-sm">
            Configure curriculum structures and batch assignments.
          </p>
        </div>
        <CheckPermission 
          permission="academic:syllabus:create" 
          institutionCode={institutionCode} 
          branchCode={branchCode}
        >
          <Button color="primary" onPress={onOpen} startContent={<Plus className="h-4 w-4" />}>
            Create Course
          </Button>
        </CheckPermission>
      </div>

      <Tabs 
        aria-label="Academic Management Tabs" 
        selectedKey={selectedKey} 
        onSelectionChange={(key) => setSelectedKey(String(key))}
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary"
        }}
      >
        <Tab
          key="courses"
          title={
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4" />
              <span>Curriculum Tree</span>
            </div>
          }
        >
          <div className="mt-4 glass-panel p-4 rounded-xl shadow-sm border border-border">
            <Accordion variant="splitted" className="w-full">
              <AccordionItem 
                key="1" 
                aria-label="Quranic Studies" 
                title={<span className="font-semibold text-foreground">Quranic Studies</span>}
                subtitle="3 Subjects • 12 Modules"
                startContent={<BookOpen className="text-primary w-5 h-5" />}
                className="bg-card/80 border border-border"
              >
                <div className="pl-12 pb-4 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50">
                    <span className="text-sm font-medium">Hifz Al-Quran (Memorization)</span>
                    <Chip size="sm" color="success" variant="flat">Semester 1-8</Chip>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50">
                    <span className="text-sm font-medium">Tajweed Fundamentals</span>
                    <Chip size="sm" color="warning" variant="flat">Semester 1-2</Chip>
                  </div>
                </div>
              </AccordionItem>
              
              <AccordionItem 
                key="2" 
                aria-label="Islamic Jurisprudence" 
                title={<span className="font-semibold text-foreground">Islamic Jurisprudence (Fiqh)</span>}
                subtitle="2 Subjects • 8 Modules"
                startContent={<BookOpen className="text-primary w-5 h-5" />}
                className="bg-card/80 border border-border"
              >
                 <div className="pl-12 pb-4 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50">
                    <span className="text-sm font-medium">Fiqh Al-Ibadat</span>
                    <Chip size="sm" color="primary" variant="flat">Semester 3-4</Chip>
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </Tab>
        
        <Tab
          key="batches"
          title={
            <div className="flex items-center space-x-2">
              <LayoutGrid className="w-4 h-4" />
              <span>Batch Assignments</span>
            </div>
          }
        >
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[2024, 2025, 2026, 2027].map((year) => (
              <Card key={year} className="bg-card/60 backdrop-blur-md border-border">
                <CardBody className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-foreground">Batch {year}</h4>
                      <p className="text-xs text-muted-foreground mt-1">120 Active Students</p>
                    </div>
                    <Chip size="sm" color="success" variant="flat">Active</Chip>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button size="sm" variant="flat" color="primary" className="w-full">
                      View Roster
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>
      </Tabs>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
        classNames={{
          base: "bg-card border border-border",
          header: "border-b border-border",
          footer: "border-t border-border"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-foreground">Create New Course</ModalHeader>
              <ModalBody className="py-6">
                <Input
                  autoFocus
                  label="Course Title"
                  placeholder="e.g. Arabic Grammar"
                  variant="bordered"
                  color="primary"
                />
                <Input
                  label="Course Code"
                  placeholder="e.g. ARB-101"
                  variant="bordered"
                  color="primary"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Create Course
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
