"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000 // Auto-dismiss after 5 seconds

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
    type: ActionType["ADD_TOAST"]
    toast: ToasterToast
  }
  | {
    type: ActionType["UPDATE_TOAST"]
    toast: Partial<ToasterToast>
  }
  | {
    type: ActionType["DISMISS_TOAST"]
    toastId?: ToasterToast["id"]
  }
  | {
    type: ActionType["REMOVE_TOAST"]
    toastId?: ToasterToast["id"]
  }

interface State {
  toasts: ToasterToast[]
}

// ───────────────────────────────────────────────────────────────
// Global state — survives Turbopack HMR re-evaluation
// ───────────────────────────────────────────────────────────────
const _g = globalThis as Record<string, unknown>;

function getGlobalArray<T>(key: string): T[] {
  if (!_g[key]) _g[key] = [];
  return _g[key] as T[];
}

function getGlobalMap<K, V>(key: string): Map<K, V> {
  if (!_g[key]) _g[key] = new Map<K, V>();
  return _g[key] as Map<K, V>;
}

function getGlobalValue<T>(key: string, initial: T): T {
  if (!_g[key]) _g[key] = initial;
  return _g[key] as T;
}

const listeners: Array<(state: State) => void> = getGlobalArray<(state: State) => void>('__toast_listeners');
const memoryState: State = getGlobalValue<State>('__toast_memoryState', { toasts: [] });
const toastTimeouts = getGlobalMap<string, ReturnType<typeof setTimeout>>('__toast_timeouts');

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
              ...t,
              open: false,
            }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

function dispatch(action: Action) {
  // Always read the current state from globalThis
  const currentState = (globalThis as Record<string, unknown>).__toast_memoryState as State || { toasts: [] };
  const newState = reducer(currentState, action);
  // Replace the global state with a new object (required for useSyncExternalStore)
  (globalThis as Record<string, unknown>).__toast_memoryState = newState;
  listeners.forEach((listener) => {
    listener() // Notify React to re-read snapshot
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
    },
  })

  // Auto-dismiss after TOAST_REMOVE_DELAY
  setTimeout(() => dismiss(), TOAST_REMOVE_DELAY)

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  // Use useSyncExternalStore for reliable external state subscription
  const state = React.useSyncExternalStore(
    (callback) => {
      listeners.push(callback)
      return () => {
        const index = listeners.indexOf(callback)
        if (index > -1) listeners.splice(index, 1)
      }
    },
    () => (globalThis as Record<string, unknown>).__toast_memoryState as State || { toasts: [] }
  )

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
