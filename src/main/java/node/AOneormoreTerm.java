/* This file was generated by SableCC (http://www.sablecc.org/). */

package node;

import analysis.*;

@SuppressWarnings("nls")
public final class AOneormoreTerm extends PTerm
{
    private PTerm _term_;
    private TPlus _plus_;

    public AOneormoreTerm()
    {
        // Constructor
    }

    public AOneormoreTerm(
        @SuppressWarnings("hiding") PTerm _term_,
        @SuppressWarnings("hiding") TPlus _plus_)
    {
        // Constructor
        setTerm(_term_);

        setPlus(_plus_);

    }

    @Override
    public Object clone()
    {
        return new AOneormoreTerm(
            cloneNode(this._term_),
            cloneNode(this._plus_));
    }

    @Override
    public void apply(Switch sw)
    {
        ((Analysis) sw).caseAOneormoreTerm(this);
    }

    public PTerm getTerm()
    {
        return this._term_;
    }

    public void setTerm(PTerm node)
    {
        if(this._term_ != null)
        {
            this._term_.parent(null);
        }

        if(node != null)
        {
            if(node.parent() != null)
            {
                node.parent().removeChild(node);
            }

            node.parent(this);
        }

        this._term_ = node;
    }

    public TPlus getPlus()
    {
        return this._plus_;
    }

    public void setPlus(TPlus node)
    {
        if(this._plus_ != null)
        {
            this._plus_.parent(null);
        }

        if(node != null)
        {
            if(node.parent() != null)
            {
                node.parent().removeChild(node);
            }

            node.parent(this);
        }

        this._plus_ = node;
    }

    @Override
    public String toString()
    {
        return ""
            + toString(this._term_)
            + toString(this._plus_);
    }

    @Override
    void removeChild(@SuppressWarnings("unused") Node child)
    {
        // Remove child
        if(this._term_ == child)
        {
            this._term_ = null;
            return;
        }

        if(this._plus_ == child)
        {
            this._plus_ = null;
            return;
        }

        throw new RuntimeException("Not a child.");
    }

    @Override
    void replaceChild(@SuppressWarnings("unused") Node oldChild, @SuppressWarnings("unused") Node newChild)
    {
        // Replace child
        if(this._term_ == oldChild)
        {
            setTerm((PTerm) newChild);
            return;
        }

        if(this._plus_ == oldChild)
        {
            setPlus((TPlus) newChild);
            return;
        }

        throw new RuntimeException("Not a child.");
    }
}
