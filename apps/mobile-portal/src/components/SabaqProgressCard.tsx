// Location: apps/mobile-portal/src/components/SabaqProgressCard.tsx
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Select, SelectItem, Button, IndexPath } from '@ui-kitten/components';
// Mocking motion for now if framer-motion-react-native is not installed
// import { motion } from 'framer-motion-react-native'; 
import { Animated } from 'react-native';

interface SabaqProgressProps {
  studentName: string;
  studentId: string;
  onSaveProgress: (data: { juz: number; startPage: number; endPage: number; grade: string }) => Promise<void>;
}

const GRADES = ['excellent', 'good', 'average', 'needs_improvement'];

export function SabaqProgressCard({ studentName, studentId, onSaveProgress }: SabaqProgressProps) {
  const [selectedGradeIndex, setSelectedGradeIndex] = useState<IndexPath>(new IndexPath(0));
  const [juz, setJuz] = useState<string>('1');
  const [startPage, setStartPage] = useState<string>('1');
  const [endPage, setEndPage] = useState<string>('1');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleCommit = async () => {
    setIsSaving(true);
    await onSaveProgress({
      juz: parseInt(juz, 10),
      startPage: parseInt(startPage, 10),
      endPage: parseInt(endPage, 10),
      grade: GRADES[selectedGradeIndex.row]
    });
    setIsSaving(false);
  };

  return (
    <Animated.View>
      <Card status="primary" style={styles.card}>
        <View style={styles.header}>
          <Text category="h6" style={styles.studentTitle}>{studentName}</Text>
          <Text category="c1" appearance="alternative">ID: {studentId.slice(0, 8)}</Text>
        </View>

        <View style={styles.formRow}>
          <View style={styles.inputBox}>
            <Text category="label" style={styles.label}>Juz</Text>
            <Select
              value={juz}
              selectedIndex={new IndexPath(parseInt(juz) - 1)}
              onSelect={(idx) => setJuz((idx as IndexPath).row + 1 + "")}
            >
              {Array.from({ length: 30 }, (_, i) => (
                <SelectItem key={i} title={`Juz ${i + 1}`} />
              ))}
            </Select>
          </View>

          <View style={styles.inputBox}>
            <Text category="label" style={styles.label}>Pages</Text>
            <View style={styles.pageRange}>
              <Select
                style={{ flex: 1 }}
                value={startPage}
                selectedIndex={new IndexPath(parseInt(startPage) - 1)}
                onSelect={(idx) => setStartPage((idx as IndexPath).row + 1 + "")}
              >
                {Array.from({ length: 604 }, (_, i) => (
                  <SelectItem key={i} title={`${i + 1}`} />
                ))}
              </Select>
              <Text style={{ marginHorizontal: 4 }}>to</Text>
              <Select
                style={{ flex: 1 }}
                value={endPage}
                selectedIndex={new IndexPath(parseInt(endPage) - 1)}
                onSelect={(idx) => setEndPage((idx as IndexPath).row + 1 + "")}
              >
                {Array.from({ length: 604 }, (_, i) => (
                  <SelectItem key={i} title={`${i + 1}`} />
                ))}
              </Select>
            </View>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text category="label" style={styles.label}>Grade</Text>
            <Select
              selectedIndex={selectedGradeIndex}
              value={GRADES[selectedGradeIndex.row].toUpperCase()}
              onSelect={index => setSelectedGradeIndex(index as IndexPath)}
            >
              {GRADES.map((g) => (
                <SelectItem key={g} title={g.toUpperCase()} />
              ))}
            </Select>
          </View>

          <Button 
            size="medium" 
            status="success" 
            onPress={handleCommit}
            disabled={isSaving}
            style={styles.saveButton}
          >
            {isSaving ? "SAVING..." : "COMMIT"}
          </Button>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827', 
    borderColor: '#1E293B',
    borderRadius: 8,
    marginBottom: 12
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 6
  },
  studentTitle: {
    color: '#00F0FF', 
    fontWeight: 'bold'
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  inputBox: {
    flex: 1,
    marginHorizontal: 4
  },
  pageRange: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    color: '#94A3B8',
    marginBottom: 4,
    fontSize: 10
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 6
  },
  saveButton: {
    borderRadius: 4,
    justifyContent: 'center'
  }
});
