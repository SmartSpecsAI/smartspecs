"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, deleteDoc, doc, addDoc, where, Timestamp } from "firebase/firestore";
import { firestore } from "@/smartspecs/lib/config/firebase-settings";
import { message } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/smartspecs/app-lib/redux/store";
import PendingMeetingsHeader from "./components/PendingMeetingsHeader";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import PendingMeetingsList from "./components/PendingMeetingsList";
import LoadingSpinner from "@/smartspecs/app-lib/components/common/LoadingSpinner";
import RequireAuth from "@/smartspecs/app-lib/components/auth/RequireAuth";

interface PendingMeeting {
  id: string;
  title: string;
  description: string;
  transcription: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    transcriptId: string;
    meetingId: string;
    date: string;
    duration: number;
    participantEmails: string[];
    host: string;
    organizer: string;
    url: string;
    eventType: string;
    clientReferenceId?: string;
  };
}

const PendingMeetingsView: React.FC = () => {
  const [meetings, setMeetings] = useState<PendingMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (currentUser) {
      fetchMeetings();
    }
  }, [currentUser]);

  const fetchMeetings = async () => {
    if (!currentUser) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const meetingsCollection = collection(firestore, "pending-meetings");
      
      // Get all meetings ordered by creation date
      const meetingsQuery = query(
        meetingsCollection, 
        orderBy("createdAt", "desc")
      );
      
      const snapshot = await getDocs(meetingsQuery);
      
      const allMeetings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PendingMeeting[];
      
      // Filter meetings where current user is host OR participant
      const userMeetings = allMeetings.filter(meeting => {
        const userEmail = currentUser.email;
        const hostEmail = meeting.metadata?.host;
        const participantEmails = meeting.metadata?.participantEmails || [];
        
        // Check if user is the host
        if (hostEmail === userEmail) {
          return true;
        }
        
        // Check if user is in participants list
        if (participantEmails.includes(userEmail)) {
          return true;
        }
        
        return false;
      });
      
      console.log(`📊 Found ${allMeetings.length} total meetings, ${userMeetings.length} for user ${currentUser.email}`);
      setMeetings(userMeetings);
    } catch (err: any) {
      console.error("Error fetching meetings:", err);
      setError(err.message || "Error loading meetings");
    } finally {
      setLoading(false);
    }
  };

  const acceptMeeting = async (meetingId: string) => {
    if (!currentUser) {
      message.error("User not authenticated");
      return;
    }

    try {
      // 1. Find the first project for the current user (simplified query)
      const projectsCollection = collection(firestore, "projects");
      const projectsQuery = query(
        projectsCollection,
        where("userId", "==", currentUser.id)
      );
      
      const projectsSnapshot = await getDocs(projectsQuery);
      
      if (projectsSnapshot.empty) {
        message.error("No projects found. Please create a project first.");
        return;
      }

      // Sort by createdAt in memory to get the most recent project
      const projects = projectsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          createdAt: data.createdAt,
          ...data
        };
      });

      // Sort by createdAt descending (most recent first)
      projects.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return bTime.getTime() - aTime.getTime();
      });

      const firstProject = projects[0];
      const projectId = firstProject.id;

      // 2. Get the pending meeting data
      const pendingMeeting = meetings.find(m => m.id === meetingId);
      if (!pendingMeeting) {
        message.error("Meeting not found");
        return;
      }

      // 3. Create a new meeting in the meetings collection
      const meetingsCollection = collection(firestore, "meetings");
      const now = Timestamp.now();
      
      const meetingData = {
        projectId: projectId,
        title: pendingMeeting.title,
        description: pendingMeeting.description,
        transcription: pendingMeeting.transcription,
        createdAt: now,
        updatedAt: now
      };

      await addDoc(meetingsCollection, meetingData);

      // 4. Delete the pending meeting
      const pendingMeetingRef = doc(firestore, "pending-meetings", meetingId);
      await deleteDoc(pendingMeetingRef);

      // 5. Update local state
      setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));

      message.success(`Meeting accepted and linked to project: ${firstProject.title}`);

    } catch (err: any) {
      console.error("Error accepting meeting:", err);
      message.error("Failed to accept meeting");
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    try {
      const meetingRef = doc(firestore, "pending-meetings", meetingId);
      await deleteDoc(meetingRef);
      
      // Update local state to remove the deleted meeting
      setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
      
      message.success("Meeting deleted successfully");
    } catch (err: any) {
      console.error("Error deleting meeting:", err);
      message.error("Failed to delete meeting");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 bg-background text-text">
      <PendingMeetingsHeader onRefresh={fetchMeetings} />

      {error && <ErrorState error={error} />}

      {meetings.length === 0 ? (
        <EmptyState />
      ) : (
        <PendingMeetingsList meetings={meetings} onDelete={deleteMeeting} onAccept={acceptMeeting} />
      )}
    </div>
  );
};

export default function PendingMeetingsPage() {
  return (
    <RequireAuth>
      <PendingMeetingsView />
    </RequireAuth>
  );
} 