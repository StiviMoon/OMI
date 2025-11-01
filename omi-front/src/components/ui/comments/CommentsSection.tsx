'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { commentsAPI, BackendComment } from '@/lib/api/comments';
import { useAuthContext } from '@/lib/context/AuthContext';

interface CommentsSectionProps {
  videoLink: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ videoLink }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [comments, setComments] = useState<BackendComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadComments();
  }, [videoLink]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentsAPI.list(videoLink);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    try {
      setSubmitting(true);
      const comment = await commentsAPI.add(videoLink, newComment.trim());
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error al agregar comentario. Por favor, intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('¿Estás seguro de eliminar este comentario?')) return;

    try {
      await commentsAPI.delete(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error al eliminar comentario.');
    }
  };

  const handleStartEdit = (comment: BackendComment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdate = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const updated = await commentsAPI.update(commentId, editContent.trim());
      setComments(comments.map(c => c.id === commentId ? updated : c));
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Error al actualizar comentario.');
    }
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserName = (comment: BackendComment) => {
    if (comment.user?.firstName && comment.user?.lastName) {
      return `${comment.user.firstName} ${comment.user.lastName}`;
    }
    if (comment.user?.firstName) {
      return comment.user.firstName;
    }
    if (comment.user?.email) {
      return comment.user.email.split('@')[0];
    }
    return 'Usuario';
  };

  return (
    <div className="mt-6 border-t border-gray-700 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-white">Comentarios</h3>
        <span className="text-sm text-gray-400">({comments.length})</span>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              maxLength={1000}
            />
            <Button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              {submitting ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-zinc-800 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            Inicia sesión para comentar
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="h-6 w-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-2 text-sm">Cargando comentarios...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No hay comentarios aún. ¡Sé el primero en comentar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-zinc-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-white font-medium text-sm">
                    {getUserName(comment)}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
                {user && user.id === comment.userId && (
                  <div className="flex gap-2">
                    {editingId === comment.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(null);
                            setEditContent('');
                          }}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        >
                          ✕
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdate(comment.id)}
                          className="h-6 w-6 p-0 text-cyan-400 hover:text-cyan-300"
                        >
                          ✓
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(comment)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-cyan-400"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(comment.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
              {editingId === comment.id ? (
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-500"
                  maxLength={1000}
                  autoFocus
                />
              ) : (
                <p className="text-gray-300 text-sm">{comment.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

