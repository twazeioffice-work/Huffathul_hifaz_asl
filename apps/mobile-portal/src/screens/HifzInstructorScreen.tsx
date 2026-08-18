import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Text, Button, Card, IconRegistry, Icon, Divider } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useOfflineSync } from '../hooks/useOfflineSync';

export const HifzInstructorScreen = () => {
  const { isOnline, pendingQueueLength, lastSyncedTime, triggerManualSync } = useOfflineSync();

  return (
    <Layout style={styles.container} level="1">
      <View style={styles.header}>
        <View>
          <Text category="h5" style={styles.title}>Hifz Instructor Portal</Text>
          <Text category="s1" appearance="hint">Class: Batch A - Morning</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text category="c1" status={isOnline ? 'success' : 'danger'}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </View>
      </View>

      <Divider />

      <Layout style={styles.content} level="2">
        <Card status="primary" style={styles.card}>
          <Text category="h6">Offline Mutex Status</Text>
          <Text category="s2" appearance="hint" style={styles.spacing}>
            Pending Mutations: {pendingQueueLength}
          </Text>
          <Text category="c1" appearance="hint" style={styles.spacing}>
            Last Synced: {lastSyncedTime ? new Date(lastSyncedTime).toLocaleTimeString() : 'Never'}
          </Text>
          <Button 
            size="small" 
            onPress={triggerManualSync}
            disabled={!isOnline || pendingQueueLength === 0}
            style={styles.syncButton}
          >
            Trigger Manual Sync
          </Button>
        </Card>

        <Text category="h6" style={styles.rosterTitle}>Today's Roster</Text>
        
        {/* Mock Roster */}
        {[
          { id: '1', name: 'Omar Al-Faruq', status: 'Pending Review', revision: 'Juz 29' },
          { id: '2', name: 'Zaid bin Thabit', status: 'Completed', revision: 'Juz 30' },
        ].map(student => (
          <Card key={student.id} style={styles.studentCard}>
            <View style={styles.studentHeader}>
              <Text category="s1">{student.name}</Text>
              <Text category="c1" status={student.status === 'Completed' ? 'success' : 'warning'}>
                {student.status}
              </Text>
            </View>
            <Text category="c2" appearance="hint">Current Assignment: {student.revision}</Text>
            <Button size="tiny" appearance="outline" style={styles.actionButton}>
              Log Evaluation
            </Button>
          </Card>
        ))}
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  title: {
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  spacing: {
    marginTop: 8,
  },
  syncButton: {
    marginTop: 16,
  },
  rosterTitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  studentCard: {
    marginBottom: 12,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  }
});
