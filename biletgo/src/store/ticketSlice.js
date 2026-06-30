import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunks
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (searchParams, { rejectWithValue }) => {
    try {
      let url = `http://localhost:3001/tickets`;
      const queryParts = [];
      
      if (searchParams?.origin) queryParts.push(`origin=${encodeURIComponent(searchParams.origin)}`);
      if (searchParams?.destination) queryParts.push(`destination=${encodeURIComponent(searchParams.destination)}`);
      if (searchParams?.date) queryParts.push(`date=${encodeURIComponent(searchParams.date)}`);
      if (searchParams?.type && searchParams.type !== 'all') queryParts.push(`type=${searchParams.type}`);
      
      if (queryParts.length > 0) {
        url += `?${queryParts.join('&')}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Veriler alınamadı.');
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message || 'Bağlantı hatası.');
    }
  }
);

export const updateTicketSeats = createAsyncThunk(
  'tickets/updateTicketSeats',
  async ({ ticketId, newSeats }, { rejectWithValue }) => {
    try {
      // 1. Fetch latest ticket data from server
      const tRes = await fetch(`http://localhost:3001/tickets/${ticketId}`);
      if (!tRes.ok) throw new Error('Bilet bilgisi doğrulanamadı.');
      const currentTicket = await tRes.json();

      // 2. Merge occupied seats
      const updatedOccupied = [...(currentTicket.occupiedSeats || []), ...newSeats];

      // 3. Patch occupied seats in database
      const response = await fetch(`http://localhost:3001/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occupiedSeats: updatedOccupied }),
      });
      if (!response.ok) {
        throw new Error('Koltuklar güncellenemedi.');
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message || 'Koltuk güncelleme hatası.');
    }
  }
);

export const addBooking = createAsyncThunk(
  'tickets/addBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3001/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) {
        throw new Error('Rezervasyon kaydedilemedi.');
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message || 'Rezervasyon hatası.');
    }
  }
);

// CRUD Thunks for Ticket Management
export const addTicket = createAsyncThunk(
  'tickets/addTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3001/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      if (!response.ok) {
        throw new Error('Bilet eklenemedi.');
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async ({ id, ticketData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3001/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      if (!response.ok) {
        throw new Error('Bilet güncellenemedi.');
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteTicket = createAsyncThunk(
  'tickets/deleteTicket',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3001/tickets/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Bilet silinemedi.');
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    list: [],
    searchQuery: {
      origin: '',
      destination: '',
      date: '',
      type: 'all', // 'all', 'bus', 'plane'
    },
    selectedTicket: null,
    selectedSeats: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = { ...state.searchQuery, ...action.payload };
    },
    setSelectedTicket: (state, action) => {
      state.selectedTicket = action.payload;
    },
    setSelectedSeats: (state, action) => {
      state.selectedSeats = action.payload;
    },
    clearBooking: (state) => {
      state.selectedTicket = null;
      state.selectedSeats = [];
    },
    clearTicketError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tickets
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update Ticket Seats (Edit/Patch action)
      .addCase(updateTicketSeats.fulfilled, (state, action) => {
        const updatedTicket = action.payload;
        // Update in list
        state.list = state.list.map((ticket) =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        );
        // Update selectedTicket if it matches
        if (state.selectedTicket && state.selectedTicket.id === updatedTicket.id) {
          state.selectedTicket = updatedTicket;
        }
      })
      // Add Ticket (CRUD POST)
      .addCase(addTicket.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update Ticket (CRUD PUT/PATCH)
      .addCase(updateTicket.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((t) => (t.id === updated.id ? updated : t));
        if (state.selectedTicket && state.selectedTicket.id === updated.id) {
          state.selectedTicket = updated;
        }
      })
      // Delete Ticket (CRUD DELETE)
      .addCase(deleteTicket.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.list = state.list.filter((t) => t.id !== deletedId);
        if (state.selectedTicket && state.selectedTicket.id === deletedId) {
          state.selectedTicket = null;
        }
      });
  },
});

export const { setSearchQuery, setSelectedTicket, setSelectedSeats, clearBooking, clearTicketError } = ticketSlice.actions;
export default ticketSlice.reducer;
