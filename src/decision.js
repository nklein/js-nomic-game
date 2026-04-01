
// ================================================
// Base class for all decision decisions
class decision {
  constructor(decision) {
    this.decision = decision;
  }

  toJson() {
    return {
      decision: this.decision,
    };
  }
};

// ================================================
class messageable_decision extends decision {
  constructor(decision, message) {
    super(decision);
    this.message = message;
  };

  toJson() {
    return {
      ...super.toJson(),
      message: this.message,
    };
  }
};

// ================================================
export class winner_decision extends messageable_decision {
  constructor(name, message) {
    super("winner", message);
    this.name = name;
  }

  toJson() {
    return {
      name: this.name,
      ...super.toJson(),
    };
  }
}

// ================================================
class pr_decision extends messageable_decision {
  constructor(id, decision, message) {
    super(decision, message);
    this.id = id;
  }

  toJson() {
    return {
      ...super.toJson(),
      id: this.id,
    };
  }
}

// ================================================
export class accept_decision extends pr_decision {
  constructor(id, message) {
    super(id, "accept", message);
  }
}

// ================================================
export class reject_decision extends pr_decision {
  constructor(id, message) {
    super(id, "reject", message);
  }
}

// ================================================
export class defer_decision extends decision {
  constructor() {
    super("defer");
  }
}
