import React from 'react';
import { INITIAL_COMMUNITIES, INITIAL_EVENTS, type ResearchCommunity, type ResearchEvent } from '../data/mockData.ts';
import { ScrollableSection } from './ScrollableSectionList.tsx';
import { 
  Users, 
  Calendar, 
  Building2, 
  UserCheck, 
  Search, 
  Plus, 
  X, 
  Filter, 
  CheckCircle2, 
  Layers, 
  Columns,
  Sparkles
} from 'lucide-react';

export const ConnectView: React.FC = () => {
  const [communities, setCommunities] = React.useState<ResearchCommunity[]>(INITIAL_COMMUNITIES);
  const [events, setEvents] = React.useState<ResearchEvent[]>(INITIAL_EVENTS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTabFilter, setActiveTabFilter] = React.useState<'all' | 'events' | 'communities'>('all');
  const [layoutMode, setLayoutMode] = React.useState<'dual' | 'full'>('dual');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState<'event' | 'community'>('event');

  const [registeredEvents, setRegisteredEvents] = React.useState<Record<string, boolean>>({
    'ev-1': true
  });
  const [joinedCommunities, setJoinedCommunities] = React.useState<Record<string, boolean>>({
    'comm-1': true
  });
  const [notification, setNotification] = React.useState<string | null>(null);

  // New symposium form state
  const [newEventTitle, setNewEventTitle] = React.useState('');
  const [newEventDate, setNewEventDate] = React.useState('Saturday, December 19, 2026');
  const [newEventTime, setNewEventTime] = React.useState('14:00 - 16:30 EAT (11:00 UTC)');
  const [newEventLocation, setNewEventLocation] = React.useState('Virtual Nexus Hall + Nairobi Innovation Hub');
  const [newEventDesc, setNewEventDesc] = React.useState('');

  // New community form state
  const [newCommName, setNewCommName] = React.useState('');
  const [newCommCategory, setNewCommCategory] = React.useState('Applied Econometrics & Data');
  const [newCommDesc, setNewCommDesc] = React.useState('');
  const [newCommTopic, setNewCommTopic] = React.useState('');

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleToggleEvent = (eventId: string) => {
    const nextState = !registeredEvents[eventId];
    setRegisteredEvents(prev => ({
      ...prev,
      [eventId]: nextState
    }));
    const event = events.find(e => e.id === eventId);
    if (event) {
      triggerNotification(
        nextState 
          ? `Registered for "${event.title}". Added to calendar schedule.`
          : `RSVP cancelled for "${event.title}".`
      );
    }
  };

  const handleToggleCommunity = (commId: string) => {
    const nextState = !joinedCommunities[commId];
    setJoinedCommunities(prev => ({
      ...prev,
      [commId]: nextState
    }));
    const comm = communities.find(c => c.id === commId);
    if (comm) {
      triggerNotification(
        nextState
          ? `Joined "${comm.name}". You now have access to working group discussions.`
          : `Left "${comm.name}".`
      );
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDesc.trim()) return;

    const newEv: ResearchEvent = {
      id: `ev-user-${Date.now()}`,
      title: newEventTitle.trim(),
      organizer: 'Nexus Research Fellow (You)',
      date: newEventDate.trim(),
      time: newEventTime.trim(),
      location: newEventLocation.trim(),
      isVirtual: true,
      registeredCount: 1,
      description: newEventDesc.trim()
    };

    setEvents(prev => [newEv, ...prev]);
    setRegisteredEvents(prev => ({ ...prev, [newEv.id]: true }));
    setIsModalOpen(false);
    setNewEventTitle('');
    setNewEventDesc('');
    triggerNotification(`Symposium "${newEv.title}" successfully scheduled and added to the scroll list.`);
  };

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommName.trim() || !newCommDesc.trim()) return;

    const newComm: ResearchCommunity = {
      id: `comm-user-${Date.now()}`,
      name: newCommName.trim(),
      category: newCommCategory.trim(),
      membersCount: 1,
      description: newCommDesc.trim(),
      activeDiscussions: 1,
      recentTopic: newCommTopic.trim() || 'Establishing cross-institutional collaborative research workflows'
    };

    setCommunities(prev => [newComm, ...prev]);
    setJoinedCommunities(prev => ({ ...prev, [newComm.id]: true }));
    setIsModalOpen(false);
    setNewCommName('');
    setNewCommDesc('');
    setNewCommTopic('');
    triggerNotification(`Community "${newComm.name}" established and appended to the scroll list.`);
  };

  // Filtered lists based on search query
  const q = searchQuery.toLowerCase().trim();
  const filteredEvents = events.filter(ev => {
    if (!q) return true;
    return (
      ev.title.toLowerCase().includes(q) ||
      ev.description.toLowerCase().includes(q) ||
      ev.location.toLowerCase().includes(q) ||
      ev.organizer.toLowerCase().includes(q)
    );
  });

  const filteredCommunities = communities.filter(comm => {
    if (!q) return true;
    return (
      comm.name.toLowerCase().includes(q) ||
      comm.description.toLowerCase().includes(q) ||
      comm.category.toLowerCase().includes(q) ||
      comm.recentTopic.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Layer 4 · Connect & Collaborative Communities
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Research Communities, Events & Working Groups
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Join peer research circles, register for bi-weekly working symposiums, and participate in academic working groups with continuous scroll lists.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => {
                setModalType('event');
                setIsModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Host Symposium</span>
            </button>
            <button
              onClick={() => {
                setModalType('community');
                setIsModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>Propose Community</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search & View Controls */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter symposiums or communities..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Segmented Filter & Layout Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setActiveTabFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeTabFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All Lists ({events.length + communities.length})
              </button>
              <button
                onClick={() => setActiveTabFilter('events')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeTabFilter === 'events'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Symposiums ({events.length})
              </button>
              <button
                onClick={() => setActiveTabFilter('communities')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeTabFilter === 'communities'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Communities ({communities.length})
              </button>
            </div>

            {/* Layout switch: Dual grid vs Full-width stack */}
            {activeTabFilter === 'all' && (
              <div className="hidden md:flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => setLayoutMode('dual')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                    layoutMode === 'dual'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Side-by-Side Dual Lists"
                >
                  <Columns className="w-3 h-3" />
                  <span>Dual</span>
                </button>
                <button
                  onClick={() => setLayoutMode('full')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                    layoutMode === 'full'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Full-Width Canvas Lists"
                >
                  <Layers className="w-3 h-3" />
                  <span>Full Width</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Lists Layout Container */}
      <div className={
        activeTabFilter === 'all' && layoutMode === 'dual'
          ? "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
          : "space-y-6"
      }>
        
        {/* Section 1: Upcoming Working Symposiums Scroll List */}
        {(activeTabFilter === 'all' || activeTabFilter === 'events') && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <ScrollableSection
              title="Upcoming Working Symposiums"
              headerRightText="Bi-Weekly Nexus Schedule"
              icon={<Calendar className="w-4 h-4 text-blue-600" />}
              countLabel={`${filteredEvents.length} scheduled`}
              accentColor="blue"
              itemCount={filteredEvents.length}
              defaultMode="list"
              listMaxHeight="max-h-[460px]"
              childrenRail={
                <>
                  {filteredEvents.map((ev) => {
                    const isRegistered = !!registeredEvents[ev.id];
                    return (
                      <div
                        key={ev.id}
                        className="w-[320px] sm:w-[380px] shrink-0 snap-start p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between hover:border-slate-300 transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-sm font-bold text-slate-900 leading-snug">{ev.title}</h3>
                            <button
                              onClick={() => handleToggleEvent(ev.id)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                                isRegistered
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-900 text-white hover:bg-slate-800'
                              }`}
                            >
                              {isRegistered ? 'Registered' : 'RSVP Now'}
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                            <span className="font-semibold text-slate-800">{ev.date}</span>
                            <span aria-hidden="true">·</span>
                            <span>{ev.time}</span>
                          </div>
                          <div className="text-xs text-slate-500">{ev.location}</div>

                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {ev.description}
                          </p>
                        </div>

                        <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 font-mono flex items-center justify-between">
                          <span>{ev.registeredCount + (isRegistered ? 1 : 0)} researchers participating</span>
                          <span className="text-blue-600 font-sans font-medium text-[11px] truncate max-w-[130px]">{ev.organizer}</span>
                        </div>
                      </div>
                    );
                  })}
                </>
              }
              childrenList={
                <>
                  {filteredEvents.map((ev) => {
                    const isRegistered = !!registeredEvents[ev.id];
                    return (
                      <div
                        key={ev.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 hover:bg-slate-50/80 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-bold text-slate-900 leading-snug">{ev.title}</h3>
                          <button
                            onClick={() => handleToggleEvent(ev.id)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                              isRegistered
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                          >
                            {isRegistered ? 'Registered' : 'RSVP Now'}
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="font-semibold text-slate-800">{ev.date}</span>
                          <span aria-hidden="true">·</span>
                          <span>{ev.time}</span>
                          <span aria-hidden="true">·</span>
                          <span>{ev.location}</span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {ev.description}
                        </p>

                        <div className="text-[11px] text-slate-500 pt-1 font-mono flex items-center justify-between">
                          <span>{ev.registeredCount + (isRegistered ? 1 : 0)} researchers participating</span>
                          <span className="text-blue-600 font-sans font-medium text-[11px]">{ev.organizer}</span>
                        </div>
                      </div>
                    );
                  })}
                </>
              }
            />
          </div>
        )}

        {/* Section 2: Active Research Communities Scroll List */}
        {(activeTabFilter === 'all' || activeTabFilter === 'communities') && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <ScrollableSection
              title="Active Research Communities"
              headerRightText="Peer-Led Working Groups"
              icon={<Users className="w-4 h-4 text-emerald-600" />}
              countLabel={`${filteredCommunities.length} communities`}
              accentColor="emerald"
              itemCount={filteredCommunities.length}
              defaultMode="list"
              listMaxHeight="max-h-[460px]"
              childrenRail={
                <>
                  {filteredCommunities.map((comm) => {
                    const isJoined = !!joinedCommunities[comm.id];
                    return (
                      <div
                        key={comm.id}
                        className="w-[320px] sm:w-[380px] shrink-0 snap-start p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between hover:border-slate-300 transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-slate-900 truncate">{comm.name}</h3>
                              <div className="text-[11px] text-slate-500">{comm.category}</div>
                            </div>
                            <button
                              onClick={() => handleToggleCommunity(comm.id)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                                isJoined
                                  ? 'bg-slate-200 text-slate-800'
                                  : 'bg-slate-900 text-white hover:bg-slate-800'
                              }`}
                            >
                              {isJoined ? 'Member' : 'Join Network'}
                            </button>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {comm.description}
                          </p>

                          <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-700">
                            <span className="font-semibold text-slate-900">Current Discussion: </span>
                            <span className="italic line-clamp-1">“{comm.recentTopic}”</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                          <span className="font-mono tabular-nums">
                            {(comm.membersCount + (isJoined ? 1 : 0)).toLocaleString()} Members
                          </span>
                          <span>{comm.activeDiscussions} Active Threads</span>
                        </div>
                      </div>
                    );
                  })}
                </>
              }
              childrenList={
                <>
                  {filteredCommunities.map((comm) => {
                    const isJoined = !!joinedCommunities[comm.id];
                    return (
                      <div
                        key={comm.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 hover:bg-slate-50/80 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">{comm.name}</h3>
                            <div className="text-[11px] text-slate-500">{comm.category}</div>
                          </div>
                          <button
                            onClick={() => handleToggleCommunity(comm.id)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                              isJoined
                                ? 'bg-slate-200 text-slate-800'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                          >
                            {isJoined ? 'Member' : 'Join Network'}
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {comm.description}
                        </p>

                        <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-700">
                          <span className="font-semibold text-slate-900">Current Discussion: </span>
                          <span className="italic">“{comm.recentTopic}”</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                          <span className="font-mono tabular-nums">
                            {(comm.membersCount + (isJoined ? 1 : 0)).toLocaleString()} Members
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{comm.activeDiscussions} Active Threads</span>
                        </div>
                      </div>
                    );
                  })}
                </>
              }
            />
          </div>
        )}

      </div>

      {/* Industry-Research Partnerships & Mentorship Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span>Industry Innovation Challenges</span>
          </div>
          <p className="text-xs text-slate-600">
            Private sector agricultural finance companies (e.g. Apollo Agriculture, Acre Africa) post applied validation challenges with research grants attached.
          </p>
        </div>

        <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
            <UserCheck className="w-4 h-4 text-purple-700" />
            <span>Senior Scholar Mentorship Matcher</span>
          </div>
          <p className="text-xs text-slate-600">
            Early-career researchers matched 1-on-1 with established professors for grant proposal refinement and econometric methodology auditing.
          </p>
        </div>
      </div>

      {/* Modal: Schedule Symposium or Propose Community */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {modalType === 'event' ? (
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Host Working Symposium</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Schedule a research presentation or clinic that will be appended to the symposium scroll list.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Symposium Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Econometric Microdata Clinic on Crop Insurance"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                      <input
                        type="text"
                        required
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                      <input
                        type="text"
                        required
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Format</label>
                    <input
                      type="text"
                      required
                      value={newEventLocation}
                      onChange={(e) => setNewEventLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Objective</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe what will be presented, methodologies covered, and what collaborators are sought..."
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                  >
                    Publish to Schedule
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateCommunity} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Propose Research Community</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Form a peer-led working group around a specialized domain or methodology.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Community Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sub-Saharan Spatial Econometrics Circle"
                      value={newCommName}
                      onChange={(e) => setNewCommName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category / Discipline</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Geospatial Analytics & Development Economics"
                      value={newCommCategory}
                      onChange={(e) => setNewCommCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Scope & Mission</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Explain the peer focus, shared datasets, or target collaborative papers..."
                      value={newCommDesc}
                      onChange={(e) => setNewCommDesc(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Discussion Topic</label>
                    <input
                      type="text"
                      placeholder="e.g. Validating 10m Sentinel-2 crop classification with ground surveys"
                      value={newCommTopic}
                      onChange={(e) => setNewCommTopic(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                  >
                    Launch Community
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
