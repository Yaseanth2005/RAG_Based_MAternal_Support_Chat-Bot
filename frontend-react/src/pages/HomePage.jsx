import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Textarea,
  Button,
  VStack,
  HStack,
  IconButton,
  Tooltip,
  useToast,
  Spinner,
  Avatar,
  Badge,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FiSend, FiMic, FiMicOff, FiInfo } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const HomePage = () => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const messageBg = useColorModeValue('gray.50', 'gray.700');
  const userMessageBg = useColorModeValue('primary.50', 'primary.900');
  
  const queryClient = useQueryClient();

  // Fetch conversation history
  const { data: messages = [], isLoading: isLoadingHistory } = useQuery(
    ['messages', conversationId],
    async () => {
      if (!conversationId) return [];
      try {
        const response = await axios.get(`/api/conversations/${conversationId}`);
        return response.data.messages || [];
      } catch (error) {
        console.error('Error fetching conversation:', error);
        toast({
          title: 'Error',
          description: 'Failed to load conversation history',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return [];
      }
    },
    {
      enabled: !!conversationId,
      refetchOnWindowFocus: false,
    }
  );

  // Send message mutation
  const sendMessage = useMutation(
    async (message) => {
      const response = await axios.post('/api/query', {
        question: message,
        conversation_id: conversationId,
        top_k: 3,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        if (!conversationId && data.conversation_id) {
          setConversationId(data.conversation_id);
        }
        queryClient.invalidateQueries(['messages', conversationId]);
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to send message',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  // Speech recognition setup
  useEffect(() => {
    let recognition = null;
    
    if ('webkitSpeechRecognition' in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: 'Speech Recognition Error',
          description: event.error === 'not-allowed' 
            ? 'Please allow microphone access to use voice input' 
            : 'Error processing voice input',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      };
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [toast]);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Speech recognition is not supported in your browser',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (isListening) {
      window.speechSynthesis.cancel();
      const recognition = new window.webkitSpeechRecognition();
      recognition.stop();
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.start();
      setInput('');
    }
    
    setIsListening(!isListening);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || sendMessage.isLoading) return;
    
    const message = input.trim();
    setInput('');
    
    try {
      await sendMessage.mutateAsync(message);
      // Auto-scroll to bottom after message is sent and response is received
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Flex direction="column" h="calc(100vh - 200px)" maxW="4xl" mx="auto" w="full">
      {/* Chat container */}
      <Box
        flex={1}
        overflowY="auto"
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
        bg={bgColor}
        p={4}
        mb={4}
        position="relative"
      >
        {isLoadingHistory ? (
          <Flex justify="center" align="center" h="full">
            <Spinner size="xl" />
          </Flex>
        ) : messages.length > 0 ? (
          <VStack align="stretch" spacing={4}>
            {messages.map((message, index) => (
              <Flex
                key={index}
                direction="column"
                align={message.role === 'user' ? 'flex-end' : 'flex-start'}
              >
                <Flex
                  maxW="80%"
                  bg={message.role === 'user' ? userMessageBg : messageBg}
                  borderRadius="lg"
                  p={3}
                  position="relative"
                >
                  <Avatar
                    name={message.role === 'user' ? 'You' : 'AI'}
                    src={message.role === 'user' ? '' : '/ai-avatar.png'}
                    size="sm"
                    mr={2}
                    mt={1}
                  />
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" mb={1}>
                      {message.role === 'user' ? 'You' : 'Maternal Care AI'}
                    </Text>
                    <Text whiteSpace="pre-wrap">{message.content}</Text>
                    
                    {message.sources && message.sources.length > 0 && (
                      <Box mt={2} fontSize="xs">
                        <Text color="gray.500" mb={1}>
                          Sources:
                        </Text>
                        <VStack align="stretch" spacing={1}>
                          {message.sources.map((source, i) => (
                            <Box
                              key={i}
                              bg={useColorModeValue('gray.100', 'gray.700')}
                              p={2}
                              borderRadius="md"
                            >
                              <Text isTruncated>{source.source_file}</Text>
                              <Badge colorScheme="green" fontSize="0.6em">
                                {Math.round(source.score * 100)}% relevant
                              </Badge>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </Box>
                </Flex>
                <Text fontSize="xs" color="gray.500" mt={1} px={2}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </Flex>
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        ) : (
          <VStack h="100%" justify="center" spacing={6} textAlign="center" px={4}>
            <Box
              p={6}
              bg={useColorModeValue('primary.50', 'primary.900')}
              borderRadius="full"
              mb={4}
            >
              <Text fontSize="4xl">🤱</Text>
            </Box>
            <Text fontSize="2xl" fontWeight="bold">
              Welcome to Maternal Care AI
            </Text>
            <Text color="gray.500" maxW="md">
              I'm here to support you through your pregnancy journey with caring, evidence-based guidance.
              Ask me anything about prenatal care, nutrition, or your baby's development.
            </Text>
            
            <VStack spacing={3} mt={6} w="full" maxW="md">
              <Text fontWeight="medium" color="gray.500">Try asking:</Text>
              <HStack spacing={3} flexWrap="wrap" justify="center">
                {[
                  'What prenatal vitamins should I take?',
                  'How can I manage morning sickness?',
                  'What foods should I avoid during pregnancy?',
                ].map((question) => (
                  <Button
                    key={question}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setInput(question);
                      inputRef.current?.focus();
                    }}
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  >
                    {question}
                  </Button>
                ))}
              </HStack>
            </VStack>
          </VStack>
        )}
        
        {sendMessage.isLoading && (
          <Flex justify="flex-start" mt={4} pl={12}>
            <Flex
              bg={messageBg}
              borderRadius="lg"
              p={3}
              align="center"
            >
              <Spinner size="sm" mr={2} />
              <Text>Thinking...</Text>
            </Flex>
          </Flex>
        )}
      </Box>

      {/* Input area */}
      <Box as="form" onSubmit={handleSubmit} position="relative">
        <HStack spacing={2} align="flex-end">
          <Box flex={1} position="relative">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your pregnancy journey..."
              minH="48px"
              maxH="150px"
              resize="none"
              overflowY="auto"
              pr="60px"
              bg={inputBg}
              borderColor={borderColor}
              _hover={{ borderColor: 'primary.300' }}
              _focus={{
                borderColor: 'primary.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
              }}
            />
            <HStack
              position="absolute"
              right="12px"
              bottom="12px"
              spacing={1}
            >
              <Tooltip label={isListening ? 'Stop listening' : 'Use voice input'}>
                <IconButton
                  icon={isListening ? <FiMicOff /> : <FiMic />}
                  onClick={toggleListening}
                  aria-label={isListening ? 'Stop listening' : 'Use voice input'}
                  size="sm"
                  variant="ghost"
                  colorScheme={isListening ? 'red' : 'gray'}
                  isRound
                />
              </Tooltip>
              <Tooltip label="Send message">
                <IconButton
                  type="submit"
                  icon={<FiSend />}
                  aria-label="Send message"
                  colorScheme="primary"
                  isRound
                  isLoading={sendMessage.isLoading}
                  isDisabled={!input.trim()}
                />
              </Tooltip>
            </HStack>
          </Box>
        </HStack>
        <HStack mt={2} justify="space-between" px={1}>
          <HStack spacing={1}>
            <Tooltip label="About this app">
              <IconButton
                icon={<FiInfo />}
                aria-label="About this app"
                size="xs"
                variant="ghost"
                onClick={onOpen}
              />
            </Tooltip>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            Press Enter to send, Shift+Enter for new line
          </Text>
        </HStack>
      </Box>

      {/* About Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>About Maternal Care AI</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Text>
                Maternal Care AI is an intelligent assistant designed to provide evidence-based information and support 
                throughout your pregnancy journey. Our goal is to make reliable maternal healthcare information 
                accessible to everyone.
              </Text>
              <Text>
                <strong>Note:</strong> This AI assistant is not a substitute for professional medical advice. 
                Always consult with your healthcare provider for personal medical advice.
              </Text>
              <Box mt={4}>
                <Text fontWeight="bold" mb={2}>Features:</Text>
                <VStack align="stretch" spacing={2}>
                  <HStack>
                    <Box w={2} h={2} bg="primary.500" borderRadius="full" mt={1.5} />
                    <Text>Voice input support</Text>
                  </HStack>
                  <HStack>
                    <Box w={2} h={2} bg="primary.500" borderRadius="full" mt={1.5} />
                    <Text>Evidence-based responses with sources</Text>
                  </HStack>
                  <HStack>
                    <Box w={2} h={2} bg="primary.500" borderRadius="full" mt={1.5} />
                    <Text>Dark/light mode</Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default HomePage;
