import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! How can I help you with your insurance questions today?'
    }
  ]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => draft.trim().length > 0 && !sending, [draft, sending]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, sending]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMessage]);
    setDraft('');
    setSending(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 450));
      const assistantMessage: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: "I’m a placeholder UI response. Wire me to your backend and I’ll answer for real."
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {!open && (
        <Fab
          color="primary"
          aria-label="open chatbot"
          onClick={() => setOpen(true)}
          sx={{ position: 'fixed', right: 20, bottom: 20, zIndex: theme => theme.zIndex.modal + 1 }}
        >
          <ChatIcon />
        </Fab>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="chatbot-title"
        PaperProps={{
          sx: {
            position: 'fixed',
            right: 20,
            bottom: 20,
            m: 0,
            width: 360,
            maxWidth: 'calc(100% - 40px)',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle
          id="chatbot-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            pr: 1
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Chatbot
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ask questions about policies, claims, pricing, and coverage.
            </Typography>
          </Box>

          <IconButton aria-label="close chatbot" onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1.5 }}>
          <Stack spacing={1.5}>
            <Box
              sx={{
                height: 280,
                overflowY: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                padding: 2,
                backgroundColor: 'background.default'
              }}
            >
              <Stack spacing={1.25}>
                {messages.map(m => (
                  <Box
                    key={m.id}
                    sx={{
                      display: 'flex',
                      justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '82%',
                        padding: '10px 12px',
                        borderRadius: 2,
                        whiteSpace: 'pre-wrap',
                        backgroundColor: m.role === 'user' ? '#34cceb' : 'grey.100',
                        color: m.role === 'user' ? 'white' : 'text.primary'
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                        {m.content}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                {sending && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        maxWidth: '82%',
                        padding: '10px 12px',
                        borderRadius: 2,
                        backgroundColor: 'grey.100'
                      }}
                    >
                      <CircularProgress size={16} />
                      <Typography variant="body2" color="text.secondary">
                        Typing…
                      </Typography>
                    </Box>
                  </Box>
                )}

                <div ref={endRef} />
              </Stack>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Type your message…"
                fullWidth
                size="small"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
              />
              <IconButton aria-label="send" onClick={() => void handleSend()} disabled={!canSend}>
                <SendIcon />
              </IconButton>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;