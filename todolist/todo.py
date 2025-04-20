#!/usr/bin/env python3
"""Text-based To-Do List CLI Application."""
import os
import json
import cmd


class TodoCLI(cmd.Cmd):
    intro = "Welcome to the To-Do List app! Type help or ? to list commands.\n"
    prompt = "(todo) "

    def __init__(self, filepath=None):
        super().__init__()
        if filepath is None:
            filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), "todo.json")
        self.filepath = filepath
        self.tasks = []
        self.load_tasks()

    def load_tasks(self):
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r") as f:
                    self.tasks = json.load(f)
            except (json.JSONDecodeError, IOError):
                print(f"Warning: Failed to load tasks from {self.filepath}. Starting with empty list.")
                self.tasks = []
        else:
            self.tasks = []

    def save_tasks(self):
        try:
            with open(self.filepath, "w") as f:
                json.dump(self.tasks, f, indent=2)
        except IOError as e:
            print(f"Error: Could not save tasks to {self.filepath}: {e}")

    def do_add(self, arg):
        """Add a new task: add <task description>"""
        description = arg.strip()
        if not description:
            print("Error: task description cannot be empty.")
            return
        self.tasks.append({"description": description, "completed": False})
        self.save_tasks()
        print(f"Added task: {description}")

    def do_list(self, arg):
        """List all tasks"""
        if not self.tasks:
            print("No tasks found.")
            return
        for idx, task in enumerate(self.tasks, 1):
            status = "[x]" if task.get("completed") else "[ ]"
            print(f"{idx}. {status} {task.get('description')}")

    def do_complete(self, arg):
        """Mark a task as completed: complete <task number>"""
        try:
            idx = int(arg.strip())
            if idx < 1 or idx > len(self.tasks):
                raise ValueError
        except ValueError:
            print("Error: please provide a valid task number.")
            return
        self.tasks[idx-1]["completed"] = True
        self.save_tasks()
        print(f"Task {idx} marked as completed.")

    def do_remove(self, arg):
        """Remove a task: remove <task number>"""
        try:
            idx = int(arg.strip())
            if idx < 1 or idx > len(self.tasks):
                raise ValueError
        except ValueError:
            print("Error: please provide a valid task number.")
            return
        task = self.tasks.pop(idx-1)
        self.save_tasks()
        print(f"Removed task {idx}: {task.get('description')}")

    def do_clear(self, arg):
        """Remove all completed tasks"""
        before = len(self.tasks)
        self.tasks = [t for t in self.tasks if not t.get("completed")]
        removed = before - len(self.tasks)
        self.save_tasks()
        print(f"Removed {removed} completed task(s).")

    def do_exit(self, arg):
        """Exit the application"""
        print("Goodbye!")
        return True

    def do_quit(self, arg):
        """Exit the application"""
        return self.do_exit(arg)

    def do_EOF(self, arg):
        """Exit on Ctrl-D"""
        print()
        return True


if __name__ == "__main__":
    TodoCLI().cmdloop()