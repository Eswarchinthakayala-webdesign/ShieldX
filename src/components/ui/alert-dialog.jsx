import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function AlertDialog({
  ...props
}) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}) {
  return (<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />);
}

function AlertDialogPortal({
  ...props
}) {
  return (<AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />);
}

function AlertDialogOverlay({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 backdrop-blur-md",
        className
      )}
      {...props} />
  );
}

function AlertDialogContent({
  className,
  size = "default",
  children,
  ...props
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "bg-[#0a0a0a] border border-white/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-6 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] duration-200 data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-md overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff1e1e] to-transparent opacity-20" />
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#ff1e1e]/10 blur-[50px] rounded-full pointer-events-none" />
        <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-[#ff1e1e]/30" />
        <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-[#ff1e1e]/30" />
        
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "flex flex-col gap-3 text-center sm:text-left relative z-10",
        className
      )}
      {...props} />
  );
}

function AlertDialogFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3 relative z-10 pt-2",
        className
      )}
      {...props} />
  );
}

function AlertDialogTitle({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "text-xl font-black text-white uppercase tracking-tight",
        className
      )}
      {...props} />
  );
}

function AlertDialogDescription({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-white/60 text-xs font-bold uppercase tracking-wide leading-relaxed", className)}
      {...props} />
  );
}

function AlertDialogMedia({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "bg-white/5 mb-4 inline-flex size-16 items-center justify-center rounded-2xl border border-white/10 text-[#ff1e1e] relative z-10",
        className
      )}
      {...props} />
  );
}

function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <Button 
      variant={variant} 
      size={size} 
      asChild
      className={cn("bg-[#ff1e1e] text-white hover:bg-[#ff1e1e]/90 hover:scale-105 active:scale-95 transition-all border-0 font-black uppercase tracking-wider text-xs rounded-xl shadow-[0_0_20px_rgba(255,30,30,0.3)] h-10 px-6", className)}
    >
      <AlertDialogPrimitive.Action data-slot="alert-dialog-action" {...props} />
    </Button>
  );
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}) {
  return (
    <Button 
      variant={variant} 
      size={size} 
      asChild
      className={cn("bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all font-bold uppercase tracking-wider text-xs rounded-xl h-10 px-6", className)}
    >
      <AlertDialogPrimitive.Cancel data-slot="alert-dialog-cancel" {...props} />
    </Button>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
